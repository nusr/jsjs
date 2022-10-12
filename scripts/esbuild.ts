import { build, BuildOptions, BuildResult, analyzeMetafile } from 'esbuild';
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

async function buildBrowserConfig(options: BuildOptions): Promise<BuildResult> {
  const minify = !!options.outfile?.includes('.min.');
  const realOptions: BuildOptions = {
    bundle: true,
    watch: isDev,
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
    minify: minify,
    metafile: minify,
  };
  Object.assign(realOptions, options);
  const result = await build(realOptions);
  if (result.metafile) {
    const text = await analyzeMetafile(result.metafile, { verbose: true });
    console.log(text);
  }
  return result;
}

function buildEditor(minify: boolean) {
  const workerEntryPoints = [
    'vs/language/json/json.worker.js',
    'vs/language/css/css.worker.js',
    'vs/language/html/html.worker.js',
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
  const htmlData = fs.readFileSync(
    path.join(__dirname, 'index.html'),
    'utf-8',
  );
  const data = fs.readFileSync(
    path.join(process.cwd(), 'test/unittest/testData.js'),
    'utf-8',
  );
  const realHtmlData = htmlData.replace('// originEditorData', `var originEditorData=\`${data}\``)
  fs.writeFileSync(path.join(distDir, 'index.html'), realHtmlData, 'utf-8')
}

function deleteDir(dir: string) {
  fs.rm(path.join(process.cwd(), dir), { recursive: true }, (error) => {
    if (error) {
      console.log(error);
    }
  });
}

async function main() {
  deleteDir('lib');
  const startPath = path.join(distDir, 'jsjs.umd.js')
  if (isDev) {
    return buildUMD(startPath);
  }
  const list = await Promise.all([
    buildUMD(startPath),
    buildESM(packageJson.module),
    buildUMD(packageJson.main),
    buildESM(packageJson.module.replace('.js', '.min.js')),
    buildUMD(packageJson.main.replace('.js', '.min.js')),
    buildNode(packageJson.main.replace('umd', 'node')),
    buildNode(packageJson.main.replace('umd', 'node.min')),
    buildEditor(false),
  ]);
  buildHtml();
  return list;
}

main().then(() => {
  console.log('finished');
});
