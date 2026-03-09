import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * TattooNOW x Restream Integration
 *
 * Creates/updates Restream live streams from episode JSON data
 *
 * Usage:
 *   node create-stream.js --data ../../sample/episode-1.json
 *   node create-stream.js --data ../../sample/episode-1.json --schedule
 */

// Configuration from environment variables
const RESTREAM_API_BASE = process.env.RESTREAM_API_BASE_URL || 'https://api.restream.io/v2';
const RESTREAM_CLIENT_ID = process.env.RESTREAM_CLIENT_ID;
const RESTREAM_CLIENT_SECRET = process.env.RESTREAM_CLIENT_SECRET;

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    dataFile: null,
    schedule: false
  };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--data' && i + 1 < args.length) {
      options.dataFile = args[i + 1];
      i++;
    } else if (args[i] === '--schedule') {
      options.schedule = true;
    }
  }

  return options;
}

// Authenticate with Restream OAuth
async function authenticateRestream() {
  if (!RESTREAM_CLIENT_ID || !RESTREAM_CLIENT_SECRET) {
    throw new Error('Missing RESTREAM_CLIENT_ID or RESTREAM_CLIENT_SECRET environment variables');
  }

  const response = await fetch(`${RESTREAM_API_BASE}/oauth/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      grant_type: 'client_credentials',
      client_id: RESTREAM_CLIENT_ID,
      client_secret: RESTREAM_CLIENT_SECRET
    })
  });

  if (!response.ok) {
    throw new Error(`Restream auth failed: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.access_token;
}

// Load episode data
function loadEpisodeData(filePath) {
  const absolutePath = path.resolve(__dirname, filePath);
  const data = fs.readFileSync(absolutePath, 'utf8');
  return JSON.parse(data);
}

// Create stream on Restream
async function createRestreamEvent(accessToken, episodeData, schedule = false) {
  const streamData = {
    title: episodeData.EPISODE_TITLE,
    description: episodeData.YOUTUBE_DESCRIPTION,
    // If scheduling, add scheduled_at timestamp
    ...(schedule && episodeData.AIR_DATE ? {
      scheduled_at: new Date(episodeData.AIR_DATE).toISOString()
    } : {}),
    // Platform configuration (enable YouTube, Facebook, LinkedIn by default)
    platforms: {
      youtube: { enabled: true },
      facebook: { enabled: true },
      linkedin: { enabled: true }
    }
  };

  const response = await fetch(`${RESTREAM_API_BASE}/streams`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(streamData)
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to create stream: ${response.status} ${error}`);
  }

  return await response.json();
}

// Main execution
async function main() {
  console.log('🎬 TattooNOW x Restream Integration\n');

  const options = parseArgs();

  if (!options.dataFile) {
    console.error('Error: --data parameter is required');
    console.log('\nUsage:');
    console.log('  node create-stream.js --data ../../sample/episode-1.json');
    console.log('  node create-stream.js --data ../../sample/episode-1.json --schedule');
    process.exit(1);
  }

  try {
    // Load episode data
    console.log(`📄 Loading episode data from: ${options.dataFile}`);
    const episodeData = loadEpisodeData(options.dataFile);
    console.log(`   Episode: ${episodeData.EPISODE_TITLE}`);
    console.log(`   Duration: ${episodeData.DURATION} minutes`);

    // Authenticate with Restream
    console.log('\n🔐 Authenticating with Restream...');
    const accessToken = await authenticateRestream();
    console.log('   ✓ Authenticated');

    // Create stream event
    console.log('\n📡 Creating Restream event...');
    const stream = await createRestreamEvent(accessToken, episodeData, options.schedule);
    console.log('   ✓ Stream created successfully!');

    // Output results
    console.log('\n✅ Success! Stream Details:');
    console.log(`   Stream ID: ${stream.id || 'N/A'}`);
    console.log(`   Title: ${stream.title || episodeData.EPISODE_TITLE}`);
    console.log(`   Status: ${stream.status || 'Created'}`);
    if (stream.url) {
      console.log(`   URL: ${stream.url}`);
    }
    if (options.schedule && episodeData.AIR_DATE) {
      console.log(`   Scheduled: ${episodeData.AIR_DATE}`);
    }

    console.log('\n📋 Next Steps:');
    console.log('   1. Configure graphics in Restream Studio (or use Placid integration)');
    console.log('   2. Set up scenes for each segment type');
    console.log('   3. Go live at scheduled time or manually start stream');

    return stream;

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

main();
