const fs = require('fs');
const path = require('path');
fs.rmdir(path.join(__dirname, '../lib'), { recursive: true }, (error) => {
  if (error) {
    console.log(error);
  }
});
