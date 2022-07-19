const {build} = require('esbuild');
const package = require('./package.json')

const license = `/**
 * @license
 *
 * Copyright [yyyy] [name of copyright owner]
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *       http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */`;

const apacheLicense = () => {
    return license
        .replace('[yyyy]', new Date().getFullYear())
        .replace('[name of copyright owner]', package.author);
};

function umdWrapper(globalName) {
    const header = `(function (global, factory) {
    const isCommonjs = typeof exports === 'object' && typeof module !== 'undefined';
    
    if (isCommonjs) {
      return factory(exports);
    }
    
    const isAmd = typeof define === 'function' && define.amd;

    if (isAmd) {
      return define(['exports'], factory);
    }

    global = typeof globalThis !== 'undefined' ? globalThis : global || self;
    factory(global.${globalName} = {});
  })(this, (function (exports) { 'use strict';`;
    const footer = `}));`;

    return {header, footer};
}

const useCaseEntries = {
    [package.name]: 'src/index.ts',
};

const base = {
    bundle: true,
    tsconfig: 'tsconfig.json',
    define: {
        'process.env.NODE_ENV': JSON.stringify('production'),
        'process.env.VERSION': JSON.stringify(package.version),
    },
    banner: {js: apacheLicense()},
};

const browserEsm = Object.entries(useCaseEntries).map((entry) => {
    const [, entryPoint] = entry;
    const outfile = package.module;

    return buildBrowserConfig({
        entryPoints: [entryPoint],
        outfile,
        format: 'esm',
    });
});

const browserUmd = Object.entries(useCaseEntries).map((entry) => {
    const [,entryPoint] = entry;
    const outfile = package.main;

    const globalName = package.name;
    const umd = umdWrapper(globalName);

    return buildBrowserConfig({
        entryPoints: [entryPoint],
        outfile,
        format: 'cjs',
        banner: {
            js: `${base.banner.js}\n${umd.header}`,
        },
        footer: {
            js: umd.footer,
        },
    });
});

/**
 * @param {import('esbuild').BuildOptions} options
 * @returns {Promise<import('esbuild').BuildResult>}
 */
function buildBrowserConfig(options) {
    return build({
        ...base,
        platform: 'browser',
        minify: false,
        sourcemap: true,
        ...options,
    });
}

async function main() {
    await Promise.all([
        ...browserEsm,
        ...browserUmd,
    ]);
}

main();