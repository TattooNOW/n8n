#!/usr/bin/env node

/**
 * TattooNOW Weekly Show - Script Generator
 *
 * Generates episode scripts by filling in the episode template with data from JSON files.
 * No AI expansion - just template placeholder replacement.
 *
 * Usage:
 *   node scripts/generate-script.js --data sample/episode-1.json
 *   node scripts/generate-script.js --data sample/episode-1.json --output custom-output.md
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    dataFile: null,
    outputFile: null,
    templateFile: null
  };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--data' && i + 1 < args.length) {
      options.dataFile = args[i + 1];
      i++;
    } else if (args[i] === '--output' && i + 1 < args.length) {
      options.outputFile = args[i + 1];
      i++;
    } else if (args[i] === '--template' && i + 1 < args.length) {
      options.templateFile = args[i + 1];
      i++;
    }
  }

  return options;
}

// Load JSON data file
function loadData(filePath) {
  try {
    const absolutePath = path.resolve(__dirname, '..', filePath);
    const data = fs.readFileSync(absolutePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error loading data file: ${error.message}`);
    process.exit(1);
  }
}

// Load template file
function loadTemplate(filePath) {
  try {
    const absolutePath = path.resolve(__dirname, '..', filePath);
    return fs.readFileSync(absolutePath, 'utf8');
  } catch (error) {
    console.error(`Error loading template file: ${error.message}`);
    process.exit(1);
  }
}

// Replace all placeholders in template with data
function fillTemplate(template, data) {
  let result = template;

  // Helper function to recursively get nested values
  function getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  // Find all placeholders in format {{KEY}} or {{NESTED.KEY}}
  const placeholderRegex = /\{\{([A-Z_\.0-9]+)\}\}/g;

  result = result.replace(placeholderRegex, (match, key) => {
    // Try direct key first
    if (data.hasOwnProperty(key)) {
      const value = data[key];
      // Handle arrays by joining with newlines or commas
      if (Array.isArray(value)) {
        // For bullet lists
        if (key.includes('POINTS') || key.includes('TOPICS') || key.includes('QUESTIONS')) {
          return value.map(item => `- ${item}`).join('\n');
        }
        // For comma-separated lists
        return value.join(', ');
      }
      return value !== null && value !== undefined ? String(value) : match;
    }

    // Try nested keys (e.g., guest.name)
    const nestedValue = getNestedValue(data, key.toLowerCase().replace(/_/g, '.'));
    if (nestedValue !== undefined) {
      if (Array.isArray(nestedValue)) {
        if (key.includes('POINTS') || key.includes('TOPICS') || key.includes('QUESTIONS')) {
          return nestedValue.map(item => `- ${item}`).join('\n');
        }
        return nestedValue.join(', ');
      }
      return String(nestedValue);
    }

    // If no value found, return empty string instead of placeholder
    return '';
  });

  return result;
}

// Write output file
function writeOutput(content, filePath) {
  try {
    const absolutePath = path.resolve(__dirname, '..', filePath);
    const dir = path.dirname(absolutePath);

    // Create directory if it doesn't exist
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(absolutePath, content, 'utf8');
    console.log(`✓ Script generated successfully: ${filePath}`);
  } catch (error) {
    console.error(`Error writing output file: ${error.message}`);
    process.exit(1);
  }
}

// Main execution
function main() {
  console.log('TattooNOW Weekly Show - Script Generator\n');

  const options = parseArgs();

  if (!options.dataFile) {
    console.error('Error: --data parameter is required');
    console.log('\nUsage:');
    console.log('  node scripts/generate-script.js --data sample/episode-1.json');
    console.log('  node scripts/generate-script.js --data sample/episode-1.json --output custom.md');
    process.exit(1);
  }

  // Set default paths
  const templateFile = options.templateFile || 'templates/episode-script.md';

  // Determine output file from data file if not specified
  let outputFile = options.outputFile;
  if (!outputFile) {
    const dataFileName = path.basename(options.dataFile, '.json');
    outputFile = `output/scripts/${dataFileName}.md`;
  }

  console.log(`Loading data from: ${options.dataFile}`);
  const data = loadData(options.dataFile);

  console.log(`Loading template from: ${templateFile}`);
  const template = loadTemplate(templateFile);

  console.log('Filling template with data...');
  const script = fillTemplate(template, data);

  console.log(`Writing output to: ${outputFile}`);
  writeOutput(script, outputFile);

  console.log('\n✓ Done!');
}

main();
