const fs = require('fs');
const path = require('path');
const esBuild = require('esbuild');
const { getEnv } = require('./env');
const cwd = process.cwd();
console.log('cwd:', cwd);
const distDir = path.join(cwd, 'dist');
const assetsDir = path.join(cwd, 'assets');
const { NODE_ENV } = getEnv();
const isProd = NODE_ENV === 'production';
const entryPath = path.join(cwd, 'src/browser.ts');
const tsconfigPath = path.join(cwd, 'tsconfig.json');
const FORMAT = 'iife';

function copyHtml() {
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir);
  }
  const htmlPath = 'index.html';
  const sourceFile = path.join(assetsDir, htmlPath);
  const targetFile = path.join(distDir, htmlPath);
  fs.copyFileSync(sourceFile, targetFile);
}

let isBuilding = false;

function buildJs() {
  if (isBuilding) {
    return;
  }
  isBuilding = true;
  const params = {
    entryPoints: [entryPath],
    format: FORMAT,
    bundle: true,
    minify: isProd,
    sourcemap: true,
    tsconfig: tsconfigPath,
    outfile: path.join(distDir, 'index.js'),
    define: {
      'process.env.NODE_ENV': JSON.stringify(NODE_ENV),
    },
  };
  esBuild
    .build({
      ...params,
      watch: isProd
        ? null
        : {
            onRebuild(error) {
              if (error) console.error('watch build failed:', error);
              else console.log(`watch build succeeded:${new Date().getTime()}`);
              buildJs();
            },
          },
    })
    .then(() => {
      copyHtml();
    })
    .catch((error) => {
      console.log(error);
    })
    .finally(() => {
      isBuilding = false;
    });
}
buildJs();
