import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * TattooNOW x Placid Integration
 *
 * Generates graphics from episode data using Placid API:
 * - Guest lower-thirds
 * - Title cards
 * - Countdown posts
 * - Blog thumbnails
 * - Social media graphics
 *
 * Usage:
 *   node generate-graphics.js --data ../../sample/episode-1.json --type all
 *   node generate-graphics.js --data ../../sample/episode-1.json --type countdown
 */

const PLACID_API_KEY = process.env.PLACID_API_KEY;
const PLACID_API_BASE = 'https://api.placid.app/api/rest';

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    dataFile: null,
    type: 'all' // all, countdown, thumbnail, lower-third, title-card
  };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--data' && i + 1 < args.length) {
      options.dataFile = args[i + 1];
      i++;
    } else if (args[i] === '--type' && i + 1 < args.length) {
      options.type = args[i + 1];
      i++;
    }
  }

  return options;
}

// Load episode data
function loadEpisodeData(filePath) {
  const absolutePath = path.resolve(__dirname, filePath);
  const data = fs.readFileSync(absolutePath, 'utf8');
  return JSON.parse(data);
}

// Generate graphic using Placid template
async function generateGraphic(templateId, data) {
  if (!PLACID_API_KEY) {
    throw new Error('Missing PLACID_API_KEY environment variable');
  }

  const response = await fetch(`${PLACID_API_BASE}/images`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${PLACID_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      template_uuid: templateId,
      layers: data,
      create_now: true
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Placid API error: ${response.status} ${error}`);
  }

  return await response.json();
}

// Generate countdown post (3 days, 1 day, 3 hours, 1 hour, live now)
async function generateCountdownPosts(episodeData) {
  console.log('📅 Generating countdown posts...');

  const countdowns = [
    { days: 3, text: '3 DAYS UNTIL' },
    { days: 1, text: 'TOMORROW' },
    { hours: 3, text: '3 HOURS' },
    { hours: 1, text: '1 HOUR' },
    { live: true, text: 'LIVE NOW' }
  ];

  const results = [];

  for (const countdown of countdowns) {
    const data = {
      episode_title: { text: episodeData.EPISODE_TITLE },
      episode_number: { text: `Episode ${episodeData.EPISODE_NUMBER}` },
      countdown_text: { text: countdown.text },
      guest_name: { text: episodeData.GUEST_INFO || 'Special Guests' },
      air_date: { text: episodeData.AIR_DATE }
    };

    // Template ID would be your Placid countdown template
    // For now, just log what would be generated
    console.log(`   Creating: ${countdown.text} countdown`);
    results.push({
      type: 'countdown',
      countdown: countdown.text,
      data
    });

    // In production, uncomment:
    // const result = await generateGraphic('YOUR_COUNTDOWN_TEMPLATE_ID', data);
    // results.push(result);
  }

  return results;
}

// Generate blog thumbnail
async function generateBlogThumbnail(episodeData) {
  console.log('🖼️  Generating blog thumbnail...');

  const data = {
    episode_title: { text: episodeData.EPISODE_TITLE },
    episode_number: { text: `EP ${episodeData.EPISODE_NUMBER}` },
    guest_name: { text: episodeData.GUEST_INFO || episodeData.GUEST_NAME },
    key_topic: { text: episodeData.KEY_TOPICS?.[0] || 'Business Education' }
  };

  console.log(`   Title: ${data.episode_title.text}`);

  // In production:
  // return await generateGraphic('YOUR_THUMBNAIL_TEMPLATE_ID', data);

  return { type: 'thumbnail', data };
}

// Generate guest lower-thirds
async function generateLowerThirds(episodeData) {
  console.log('👤 Generating guest lower-thirds...');

  const results = [];

  // Handle different segment types
  for (let i = 1; i <= 3; i++) {
    const segmentType = episodeData[`SEGMENT_${i}_TYPE`];

    if (segmentType === 'showcase' || segmentType === 'interview') {
      const guestName = episodeData[`SEGMENT_${i}_ARTIST_NAME`] ||
                       episodeData[`SEGMENT_${i}_GUESTS`];
      const guestTitle = episodeData[`SEGMENT_${i}_ARTIST_TITLE`] || '';
      const instagram = episodeData[`SEGMENT_${i}_ARTIST_INSTAGRAM`] || '';

      if (guestName) {
        const data = {
          guest_name: { text: guestName },
          guest_title: { text: guestTitle },
          instagram: { text: instagram ? `@${instagram}` : '' }
        };

        console.log(`   Segment ${i}: ${guestName} - ${guestTitle}`);
        results.push({
          type: 'lower-third',
          segment: i,
          data
        });

        // In production:
        // const result = await generateGraphic('YOUR_LOWER_THIRD_TEMPLATE_ID', data);
        // results.push(result);
      }
    }
  }

  return results;
}

// Generate title card
async function generateTitleCard(episodeData) {
  console.log('🎬 Generating title card...');

  const data = {
    episode_title: { text: episodeData.EPISODE_TITLE },
    episode_number: { text: episodeData.EPISODE_NUMBER },
    tagline: { text: 'Amplifying Tattooers to Leave Lasting Impact' },
    air_date: { text: episodeData.AIR_DATE }
  };

  console.log(`   ${data.episode_title.text}`);

  // In production:
  // return await generateGraphic('YOUR_TITLE_CARD_TEMPLATE_ID', data);

  return { type: 'title-card', data };
}

// Main execution
async function main() {
  console.log('🎨 TattooNOW x Placid Graphics Generator\n');

  const options = parseArgs();

  if (!options.dataFile) {
    console.error('Error: --data parameter is required');
    console.log('\nUsage:');
    console.log('  node generate-graphics.js --data ../../sample/episode-1.json --type all');
    console.log('  node generate-graphics.js --data ../../sample/episode-1.json --type countdown');
    console.log('\nTypes: all, countdown, thumbnail, lower-third, title-card');
    process.exit(1);
  }

  try {
    // Load episode data
    console.log(`📄 Loading episode data from: ${options.dataFile}`);
    const episodeData = loadEpisodeData(options.dataFile);
    console.log(`   Episode: ${episodeData.EPISODE_TITLE}\n`);

    const results = {
      episode: episodeData.EPISODE_NUMBER,
      title: episodeData.EPISODE_TITLE,
      graphics: []
    };

    // Generate requested graphics
    if (options.type === 'all' || options.type === 'countdown') {
      const countdowns = await generateCountdownPosts(episodeData);
      results.graphics.push(...countdowns);
    }

    if (options.type === 'all' || options.type === 'thumbnail') {
      const thumbnail = await generateBlogThumbnail(episodeData);
      results.graphics.push(thumbnail);
    }

    if (options.type === 'all' || options.type === 'lower-third') {
      const lowerThirds = await generateLowerThirds(episodeData);
      results.graphics.push(...lowerThirds);
    }

    if (options.type === 'all' || options.type === 'title-card') {
      const titleCard = await generateTitleCard(episodeData);
      results.graphics.push(titleCard);
    }

    console.log(`\n✅ Generated ${results.graphics.length} graphics!`);
    console.log('\n📋 Summary:');
    results.graphics.forEach((g, i) => {
      console.log(`   ${i + 1}. ${g.type}${g.countdown ? ` (${g.countdown})` : ''}`);
    });

    console.log('\n💡 Next Steps:');
    console.log('   1. Set up Placid templates with your branding');
    console.log('   2. Add template IDs to this script');
    console.log('   3. Graphics will be auto-generated and can be used in:');
    console.log('      - Restream Studio (upload manually or via custom RTMP)');
    console.log('      - Social media posts (automated via n8n)');
    console.log('      - Blog/newsletter (automated)');

    // Save results
    const outputPath = path.join(__dirname, `../../output/graphics-${episodeData.EPISODE_NUMBER}.json`);
    fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
    console.log(`\n💾 Results saved to: ${outputPath}`);

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

main();
