// Script to generate palette.js from palette-source.html (Computer Hope HTML color codes)
// Usage: node generate-palette.js

import fs from 'fs';
import * as cheerio from 'cheerio';

const html = fs.readFileSync('src/palette-source.html', 'utf8');
const $ = cheerio.load(html);

const palette = {};

$('tr.tcw').each((i, row) => {
  // Each row should have two sets of (code, name) pairs
  const tds = $(row).find('td');
  for (let j = 0; j < tds.length; j += 2) {
    const codeCell = $(tds[j]);
    const nameCell = $(tds[j + 1]);
    if (!codeCell.length || !nameCell.length) continue;
    const code = codeCell.find('a').first().text().toUpperCase();
    let name = nameCell.text().replace(/\s*\(W3C\)/, '').trim();
    // Split on ' or ' to handle variants
    let names = name.split(/\s+or\s+/i);
    for (let n of names) {
      // Remove all spaces and lowercase
      const key = n.replace(/\s+/g, '').toLowerCase();
      if (!key) continue; // Skip empty keys
      if (!(key in palette)) {
        palette[key] = code;
      }
    }
  }
});

// Write palette.js
const out = `// Generated from palette-source.html (Computer Hope HTML color codes)\n// Do not edit by hand. Regenerate using generate-palette.js\n\nexport const PALETTE = ${JSON.stringify(palette, null, 2)};\n`;
fs.writeFileSync('src/palette.js', out);

console.log('palette.js generated with', Object.keys(palette).length, 'colors.'); 