'use strict';
const fs = require('fs');
const path = require('path');
const { build } = require('esbuild');

function init() {
  const dir = path.join(process.cwd(), 'scripts');

  fs.readdir(dir, (error, list) => {
    if (error) {
      console.log(error);
      return;
    }
    for (const item of list) {
      const ext = path.extname(item);
      const filePath = path.join(dir, item);
      if (ext === '.ts') {
        const temp = filePath.replace('.ts', '.js');
        fs.unlink(temp, (error) => {
          if (error) {
            console.log(error);
          }
          build({
            entryPoints: [filePath],
            outfile: temp,
            format: 'cjs',
          });
        });
      } else if (ext === '.js') {
        fs.unlink(item, (error) => {
          if (error) {
            console.log(error);
          }
        });
      }
    }
  });
}

init();
