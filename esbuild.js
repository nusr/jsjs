const { build } = require('esbuild');
const package = require('./package.json');

const envConfig = getEnv();
const productionMode = 'production';
const nodeEnv = envConfig.NODE_ENV || productionMode;
const isDev = nodeEnv === 'development';
console.log('NODE_ENV', nodeEnv)
const globalName = '__export__';
function getEnv() {
  const [, , ...rest] = process.argv;
  return rest.reduce((prev, current = '') => {
    const [key = '', value = ''] = current.trim().split('=');
    const t = key.trim();
    if (t) {
      prev[t] = value.trim();
    }
    return prev;
  }, {});
}

function umdWrapper() {
  const header = `(function (global, factory) {
            typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
            typeof define === 'function' && define.amd ? define(['exports'], factory) :
              (global = global || self, factory(global.${package.name} = {}));
       })(this, (function (exports) { 'use strict';`;

  const footer = `
    for(var key in ${globalName}) {
            exports[key] = ${globalName}[key]
        }
    }));`;

  return { header, footer };
}

const licenseText = ''

/**
 * build esm
 * @param { string } filePath 
 * @returns 
 */
function buildESM(filePath) {
  return buildBrowserConfig({
    outfile: filePath,
    format: 'esm',
  });
}

/**
 * build umd
 * @param { string } filePath 
 * @returns 
 */
function buildUMD(filePath) {
  const umd = umdWrapper();
  return buildBrowserConfig({
    outfile: filePath,
    format: 'iife',
    globalName,
    banner: {
      js: `${licenseText}\n${umd.header}`,
    },
    footer: {
      js: umd.footer,
    },
  });
}

/**
 * @param {import('esbuild').BuildOptions} options
 * @returns {Promise<import('esbuild').BuildResult>}
 */
function buildBrowserConfig(options) {
  const minify = options.outfile.includes('min')
  return build({
    bundle: true,
    watch: isDev,
    entryPoints: ['src/index.ts'],
    tsconfig: 'tsconfig.json',
    define: {
      "process.env.NODE_ENV": JSON.stringify(nodeEnv),
      "process.env.VERSION": JSON.stringify(package.version),
    },
    banner: {
      js: licenseText,
    },
    platform: 'browser',
    sourcemap: true,
    minify: minify,
    ...options,
  });
}

async function main() {
  if (isDev) {
    return buildUMD(package.main);
  }
  return await Promise.all([
    buildUMD('assets/lox.umd.js'),
    buildESM(package.module),
    buildUMD(package.main),
    buildESM(package.module.replace('js', 'min.js')),
    buildUMD(package.main.replace('js', 'min.js')),
  ]);
}

main().then(() => {
  console.log('finished');
});
