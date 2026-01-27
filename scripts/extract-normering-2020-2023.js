#!/usr/bin/env node
/**
 * Extract normering data from PDFs for 2020-2023 tests
 * Uses pdftotext to extract text, then parses tables into JSON
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const tests = [
  { slug: 'hosten-2023', date: '2023-10-22', code: '23b' },
  { slug: 'varen-2023', date: '2023-03-25', code: '23a' },
  { slug: 'hosten-2022', date: '2022-10-23', code: '22b' },
  { slug: 'varen-2022', date: '2022-05-07', code: '22a2' },
  { slug: 'varen-2022-mars', date: '2022-03-12', code: '22a1' },
  { slug: 'hosten-2021', date: '2021-10-24', code: '21b' },
  { slug: 'varen-2021', date: '2021-05-08', code: '21a2' },
  { slug: 'varen-2021-mars', date: '2021-03-13', code: '21a1' },
  { slug: 'hosten-2020', date: '2020-10-25', code: '20b' },
];

function parseNumber(str) {
  // Handle Swedish number format: "42 101" -> 42101, "0,88" -> 0.88
  return parseFloat(str.replace(/\s/g, '').replace(',', '.'));
}

function extractTotalDistribution(pdfPath) {
  const text = execSync(`pdftotext -layout "${pdfPath}" -`, { encoding: 'utf-8' });

  // Find mean and stdDev
  const meanMatch = text.match(/Medelvärde\s*=\s*([\d,.]+)/);
  const stdDevMatch = text.match(/Standardavvikelse\s*=\s*([\d,.]+)/);

  if (!meanMatch || !stdDevMatch) {
    throw new Error(`Could not find mean/stdDev in ${pdfPath}`);
  }

  const mean = parseNumber(meanMatch[1]);
  const stdDev = parseNumber(stdDevMatch[1]);

  // Extract distribution table (41 rows for total)
  const distribution = [];
  let totalParticipants = 0;

  // Match rows like: "               0.00                               155            0.4                        0.4"
  // Use a simpler approach: split by multiple spaces and look for the pattern
  const lines = text.split('\n');
  for (const line of lines) {
    // Remove excessive whitespace and split
    const parts = line.trim().split(/\s+/);

    // We're looking for lines with exactly 4 parts: score, count, percentage, cumulative
    // And the first part should be a score in format X.XX
    if (parts.length === 4 && /^\d+\.\d{2}$/.test(parts[0])) {
      const hpScore = parseNumber(parts[0]);
      const count = parseNumber(parts[1]);
      const percentage = parseNumber(parts[2]);
      const cumulativePercentage = parseNumber(parts[3]);

      distribution.push({ hpScore, count, percentage, cumulativePercentage });
      totalParticipants += count;
    }
  }

  // Validation
  if (distribution.length !== 41) {
    console.warn(`Warning: Expected 41 rows, got ${distribution.length} in ${pdfPath}`);
  }

  return { mean, stdDev, totalParticipants, distribution };
}

function extractPartDistribution(pdfPath, expectedRows = 21) {
  const text = execSync(`pdftotext -layout "${pdfPath}" -`, { encoding: 'utf-8' });

  // Find mean and stdDev
  const meanMatch = text.match(/Medelvärde\s*=\s*([\d,.]+)/);
  const stdDevMatch = text.match(/Standardavvikelse\s*=\s*([\d,.]+)/);

  if (!meanMatch || !stdDevMatch) {
    throw new Error(`Could not find mean/stdDev in ${pdfPath}`);
  }

  const mean = parseNumber(meanMatch[1]);
  const stdDev = parseNumber(stdDevMatch[1]);

  // Extract distribution table (21 rows for verbal/kvant)
  const distribution = [];
  let totalParticipants = 0;

  // Match rows like: "0 - 18    0.0    1011    2.4    2.4"
  // Format: score_range    normerad_poäng    antal    andel    kumulativ
  const lines = text.split('\n');
  for (const line of lines) {
    const parts = line.trim().split(/\s+/);

    // We're looking for lines with exactly 5 parts: score_range (2 parts), hp_score, count, percentage, cumulative
    // Example: ["0", "-", "18", "0.0", "1011", "2.4", "2.4"]
    // Or after splitting: may have "0-18" as one part or "0", "-", "18" as three parts
    // Simplify: look for lines where second-to-last or third-to-last has pattern X.X
    if (parts.length >= 4) {
      // Try to find the hpScore (X.X format)
      let hpScoreIdx = -1;
      for (let i = 0; i < parts.length; i++) {
        if (/^\d+\.\d$/.test(parts[i])) {
          hpScoreIdx = i;
          break;
        }
      }

      // If we found hpScore and have 3 more values after it
      if (hpScoreIdx >= 0 && hpScoreIdx + 3 < parts.length) {
        const hpScore = parseNumber(parts[hpScoreIdx]);
        const count = parseNumber(parts[hpScoreIdx + 1]);
        const percentage = parseNumber(parts[hpScoreIdx + 2]);
        const cumulativePercentage = parseNumber(parts[hpScoreIdx + 3]);

        distribution.push({ hpScore, count, percentage, cumulativePercentage });
        totalParticipants += count;
      }
    }
  }

  // Validation
  if (distribution.length !== expectedRows) {
    console.warn(`Warning: Expected ${expectedRows} rows, got ${distribution.length} in ${pdfPath}`);
  }

  return { mean, stdDev, totalParticipants, distribution };
}

function extractTestData(test) {
  const pdfDir = path.join(__dirname, '..', 'apps', 'web', 'public', 'pdfs', test.slug);

  console.log(`\nExtracting ${test.slug}...`);

  // Extract data from all three PDFs
  const totalPdf = path.join(pdfDir, `norm${test.code}-helaprovet.pdf`);
  const verbalPdf = path.join(pdfDir, `norm${test.code}-verb.pdf`);
  const kvantPdf = path.join(pdfDir, `norm${test.code}-kvant.pdf`);

  const total = extractTotalDistribution(totalPdf);
  const verbal = extractPartDistribution(verbalPdf);
  const kvantitativ = extractPartDistribution(kvantPdf);

  console.log(`  Total: ${total.distribution.length} rows, mean=${total.mean}, stdDev=${total.stdDev}, participants=${total.totalParticipants}`);
  console.log(`  Verbal: ${verbal.distribution.length} rows, mean=${verbal.mean}, stdDev=${verbal.stdDev}`);
  console.log(`  Kvant: ${kvantitativ.distribution.length} rows, mean=${kvantitativ.mean}, stdDev=${kvantitativ.stdDev}`);

  return {
    testId: test.slug,
    testDate: test.date,
    total,
    verbal,
    kvantitativ
  };
}

// Main execution
console.log('Extracting normering data for 2020-2023 tests...');

for (const test of tests) {
  try {
    const data = extractTestData(test);

    // Write JSON file
    const outputPath = path.join(__dirname, '..', 'apps', 'web', 'src', 'data', 'normering', `${test.slug}.json`);
    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));

    console.log(`  ✓ Written to ${path.basename(outputPath)}`);
  } catch (error) {
    console.error(`  ✗ Error processing ${test.slug}:`, error.message);
  }
}

console.log('\nExtraction complete!');
