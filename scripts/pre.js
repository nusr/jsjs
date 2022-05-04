const fs = require('fs');
const path = require('path');
fs.rmdirSync(path.join(__dirname, '../lib'), { recursive: true });
