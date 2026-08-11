const fs = require('fs');
const path = require('path');

const imgPath = path.join(__dirname, '../public/logo-icon.png');
const buf = fs.readFileSync(imgPath);
const b64 = 'data:image/png;base64,' + buf.toString('base64');
const tsContent = `export const LOGO_ICON_BASE64 = "${b64}";\n`;
fs.writeFileSync(path.join(__dirname, '../src/components/logoIconBase64.ts'), tsContent);
console.log('Saved logoIconBase64.ts successfully!');
