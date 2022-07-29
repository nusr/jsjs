import { build, BuildOptions, BuildResult, analyzeMetafile } from 'esbuild';
import packageJson from './package.json';
import * as fs from 'fs';
import * as path from 'path';

const envConfig = getEnv();
const productionMode = 'production';
const nodeEnv = envConfig.NODE_ENV || productionMode;
const isDev = nodeEnv === 'development';
console.log('NODE_ENV', nodeEnv);
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

async function buildBrowserConfig(options: BuildOptions): Promise<BuildResult> {
  const minify = options.outfile?.includes('min');
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

function buildTestData() {
  const getAllFiles = (dirPath, fileList: string[] = [], index = 0) => {
    const files = fs.readdirSync(dirPath);
    for (const file of files) {
      if (fs.statSync(dirPath + '/' + file).isDirectory()) {
        fileList = getAllFiles(dirPath + '/' + file, fileList, index + 1);
      } else {
        fileList.push(path.join(dirPath, '/', file));
      }
    }
    return fileList;
  };
  const dirPath = path.join(process.cwd(), 'test');
  const fileList = getAllFiles(dirPath);
  const result: Array<{ name: string; text: string }> = [];
  for (let i = 0; i < fileList.length; i++) {
    const item = fileList[i];
    const data = fs.readFileSync(item, 'utf-8');
    result.push({
      name: `${i + 1}.${path.basename(item)}`,
      text: data,
    });
  }
  fs.writeFileSync(
    path.join(process.cwd(), 'assets', 'testData.json'),
    JSON.stringify(result),
    'utf-8',
  );
}

function buildBin() {
  const text = fs.readFileSync(
    path.join(process.cwd(), 'scripts', 'bin.js'),
    'utf-8',
  );
  fs.writeFileSync(
    path.join(process.cwd(), 'bin/lox'),
    '#!/usr/bin/env node\n' + text,
    'utf-8',
  );
}

async function main() {
  if (isDev) {
    return buildUMD(packageJson.main);
  }
  buildTestData();
  buildBin();
  return await Promise.all([
    buildUMD('assets/lox.umd.js'),
    buildESM(packageJson.module),
    buildUMD(packageJson.main),
    buildESM(packageJson.module.replace('js', 'min.js')),
    buildUMD(packageJson.main.replace('js', 'min.js')),
  ]);
}

main().then(() => {
  console.log('finished');
});
