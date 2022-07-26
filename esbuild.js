const { build } = require('esbuild');
const package = require('./package.json');

const envConfig = getEnv();
const productionMode = 'production';
const nodeEnv = envConfig.NODE_ENV || productionMode;
const isDev = nodeEnv !== productionMode;
const globalName = '__export__';
function getEnv() {
  const [, , ...rest] = process.argv;
  return rest.reduce((prev, current = '') => {
    const [key = '', value = ''] = current.trim();
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

function buildESM(isMinify = false) {
  let filePath = package.module;
  if (isMinify) {
    filePath = filePath.replace('js', 'min.js');
  }
  return buildBrowserConfig({
    outfile: filePath,
    format: 'esm',
    minify: isMinify,
  });
}

function buildUMD(isMinify = false) {
  let filePath = package.main;
  if (isMinify) {
    filePath = filePath.replace('js', 'min.js');
  }
  const umd = umdWrapper();
  return buildBrowserConfig({
    outfile: filePath,
    minify: isMinify,
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
  return build({
    bundle: true,
    watch: isDev,
    entryPoints: ['src/index.ts'],
    tsconfig: 'tsconfig.json',
    define: {
      'process.env.NODE_ENV': JSON.stringify(nodeEnv),
      'process.env.VERSION': JSON.stringify(package.version),
    },
    banner: {
      js: licenseText,
    },
    platform: 'browser',
    minify: false,
    sourcemap: true,
    ...options,
  });
}

async function main() {
  if (isDev) {
    return buildUMD();
  }
  return await Promise.all([
    buildESM(),
    buildUMD(),
    buildESM(true),
    buildUMD(true),
  ]);
}

main().then(() => {
  console.log('finished');
});
