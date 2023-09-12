import { build, BuildOptions, BuildResult, context } from 'esbuild';
import packageJson from '../package.json';
import * as fs from 'fs';
import * as path from 'path';

const envConfig = getEnv();
const productionMode = 'production';
const nodeEnv = envConfig['NODE_ENV'] || productionMode;
const isDev = nodeEnv === 'development';
const globalName = '__export__';
const licenseText = fs.readFileSync(
  path.join(process.cwd(), 'LICENSE'),
  'utf-8',
);
const distDir = path.join(process.cwd(), 'dist');

function getEnv(): Record<string, string> {
  const result: Record<string, string> = {};
  const rest = process.argv.slice(2);
  return rest.reduce((prev, current = '') => {
    const [key = '', value = ''] = current.trim().split('=');
    const t = key.trim();
    if (t) {
      prev[t] = value.trim();
    }
    return prev;
  }, result);
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
      js: `/* \n${licenseText} \n*/${umd.header}`,
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

function buildBrowserConfig(options: BuildOptions) {
  const minify = !!options.outfile?.includes('.min.');
  const realOptions: BuildOptions = {
    bundle: true,
    entryPoints: ['src/index.ts'],
    tsconfig: 'tsconfig.json',
    define: {
      'process.env.NODE_ENV': JSON.stringify(nodeEnv),
      'process.env.VERSION': JSON.stringify(packageJson.version),
    },
    banner: {
      js: `/* \n${licenseText}\n*/`,
    },
    platform: 'browser',
    sourcemap: true,
    minify,
    metafile: minify,
  };
  Object.assign(realOptions, options);
  return realOptions;
}

function buildEditor(minify: boolean) {
  const workerEntryPoints = [
    'vs/language/typescript/ts.worker.js',
    'vs/editor/editor.worker.js',
  ];
  const commonOptions: BuildOptions = {
    tsconfig: 'tsconfig.json',
    sourcemap: true,
    bundle: true,
    format: 'iife',
    outdir: distDir,
    minify,
    define: {
      'process.env.NODE_ENV': JSON.stringify(nodeEnv),
      'process.env.VERSION': JSON.stringify(packageJson.version),
    },
  };
  const list: Promise<BuildResult>[] = [];
  const editorDir = path.join(process.cwd(), 'node_modules/monaco-editor/esm/');
  list.push(
    build({
      ...commonOptions,
      entryPoints: workerEntryPoints.map((entry) => `${editorDir}${entry}`),
      outbase: editorDir,
    }),
  );

  list.push(
    build({
      ...commonOptions,
      entryPoints: [path.join(__dirname, 'editor.ts')],
      loader: {
        '.ttf': 'file',
      },
    }),
  );
  return Promise.all(list);
}

function buildHtml() {
  fs.copyFileSync(
    path.join(__dirname, 'index.html'),
    path.join(distDir, 'index.html'),
  );
}

function deleteDir(dir: string) {
  fs.rm(path.join(process.cwd(), dir), { recursive: true }, (error) => {
    if (error) {
      console.log(error);
    }
  });
}

async function buildProd() {
  await Promise.all(
    [
      buildUMD(path.join(distDir, 'jsjs.umd.js')),
      buildESM(packageJson.module),
      buildUMD(packageJson.main),
      buildESM(packageJson.module.replace('.js', '.min.js')),
      buildUMD(packageJson.main.replace('.js', '.min.js')),
      buildNode(packageJson.main.replace('umd', 'node')),
      buildNode(packageJson.main.replace('umd', 'node.min')),
    ].map((item) => build(item)),
  );
}

async function buildDev() {
  const options = buildUMD(path.join(distDir, 'jsjs.umd.js'));
  const ctx = await context({
    ...options,
  });

  await ctx.watch();

  const { port } = await ctx.serve({
    servedir: distDir,
  });
  const url = `http://localhost:${port}`;

  console.log(`running in: ${url}`);
}

async function init() {
  deleteDir('lib');
  deleteDir('dist');
  if (isDev) {
    buildDev();
  } else {
    buildProd();
  }
  await buildEditor(!isDev);
  buildHtml();
}
init();
