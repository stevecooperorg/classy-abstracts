// Script to generate help.html from help-template.html and help-body.html
// Usage: node generate-help.js
import fs from 'fs';

const templatePath = 'classy-abstracts/help-template.html';
const bodyPath = 'classy-abstracts/src/help-body.html';
const outputPath = 'classy-abstracts/public/help.html';

const template = fs.readFileSync(templatePath, 'utf8');
const body = fs.readFileSync(bodyPath, 'utf8');

// Replace <!--CONTENT--> in the template with the body HTML
const result = template.replace('<!--CONTENT-->', body);

fs.writeFileSync(outputPath, result);
console.log('help.html generated in public/.');
