import { build, BuildOptions, BuildResult, analyzeMetafile } from 'esbuild';
import packageJson from '../package.json';
import * as fs from 'fs';
import * as path from 'path';

const envConfig = getEnv();
const productionMode = 'production';
const nodeEnv = envConfig.NODE_ENV || productionMode;
const isDev = nodeEnv === 'development';
const globalName = '__export__';
const licenseText = '';

function getEnv(): Record<string, string> {
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
              (global = global || self, factory(global.${packageJson.name} = {}));
       })(this, (function (exports) { 'use strict';`;

  const footer = `
    for(var key in ${globalName}) {
            exports[key] = ${globalName}[key]
        }
    }));`;

  return { header, footer };
}

/**
 * build esm
 * @param { string } filePath
 */
function buildESM(filePath: string) {
  return buildBrowserConfig({
    outfile: filePath,
    format: 'esm',
  });
}

/**
 * build umd
 */
function buildUMD(filePath: string) {
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
 * build esm
 * @param { string } filePath
 */
function buildNode(filePath: string) {
  return buildBrowserConfig({
    outfile: filePath,
    format: 'cjs',
    platform: 'node',
    entryPoints: ['src/node.ts'],
  });
}

async function buildBrowserConfig(options: BuildOptions): Promise<BuildResult> {
  const minify = options.outfile?.includes('.min.');
  const result = await build({
    bundle: true,
    watch: isDev,
    entryPoints: ['src/index.ts'],
    tsconfig: 'tsconfig.json',
    define: {
      'process.env.NODE_ENV': JSON.stringify(nodeEnv),
      'process.env.VERSION': JSON.stringify(packageJson.version),
    },
    banner: {
      js: licenseText,
    },
    platform: 'browser',
    sourcemap: true,
    minify: minify,
    metafile: minify,
    ...options,
  });
  if (result.metafile) {
    const text = await analyzeMetafile(result.metafile, { verbose: true });
    console.log(text);
  }
  return result;
}

async function main() {
  fs.rm(path.join(process.cwd(), 'lib'), { recursive: true }, (error) => {
    if (error) {
      console.log(error);
    }
  });
  const startPath = 'assets/jsjs.umd.js';
  if (isDev) {
    return buildUMD(startPath);
  }
  return await Promise.all([
    buildUMD(startPath),
    buildESM(packageJson.module),
    buildUMD(packageJson.main),
    buildESM(packageJson.module.replace('.js', '.min.js')),
    buildUMD(packageJson.main.replace('.js', '.min.js')),
    buildNode(packageJson.main.replace('umd', 'node')),
    buildNode(packageJson.main.replace('umd', 'node.min')),
  ]);
}

main().then(() => {
  console.log('finished');
});
