/* Ties v1.js to the exact v1.css it was built with. Pages caches each file for ten minutes, so
   right after a deploy a visitor could get the new script with the old stylesheet; asking for
   v1.css?v=<hash of its content> makes that pair impossible. */
const fs = require('fs');
const crypto = require('crypto');
const hash = crypto.createHash('sha256').update(fs.readFileSync('dist/v1.css')).digest('hex').slice(0, 10);
const js = fs.readFileSync('dist/v1.js', 'utf8');
if (!js.includes('__CSS_VERSION__')) throw new Error('v1.js has no __CSS_VERSION__ placeholder');
fs.writeFileSync('dist/v1.js', js.replaceAll('__CSS_VERSION__', hash));
console.log('v1.css version', hash);
