import { transformSync, TransformOptions } from 'esbuild';
import * as path from 'path';

const getExt = (str: string): string => {
  const basename = path.basename(str);
  const firstDot = basename.indexOf(".");
  const lastDot = basename.lastIndexOf(".");
  const extname = path.extname(basename).replace(/(\.[a-z0-9]+).*/i, "$1");

  if (firstDot === lastDot) return extname;

  return basename.slice(firstDot, lastDot) + extname;
};

const getOptions = (config: any) => {
  let options = {};
  const transform = config.transform || [];
  for (let i = 0;i < transform.length;i++) {
    options = transform[i][2];
  }

  return options;
};

interface Options {
  jsxFactory?: string
  jsxFragment?: string
  sourcemap?: boolean | 'inline' | 'external'
  loaders?: {
    [ext: string]: any;
  },
  target?: string
  format?: TransformOptions['format']
}


function process(content: string, filename: string, config: any) {
  const options: Options = getOptions(config);

  const ext = getExt(filename);
  const loader =
    options?.loaders && options?.loaders[ext]
      ? options.loaders[ext]
      : path.extname(filename).slice(1);

  const sourcemaps = options?.sourcemap
    ? { sourcemap: true, sourcefile: filename }
    : {};
  const realOptions: TransformOptions = {
    loader,
    format: options?.format || "cjs",
    target: options?.target || "es2018",
    ...(options?.jsxFactory ? { jsxFactory: options.jsxFactory } : {}),
    ...(options?.jsxFragment ? { jsxFragment: options.jsxFragment } : {}),
    ...sourcemaps,
  };
  const result = transformSync(content, realOptions);

  return {
    code: result.code,
    map: result?.map
      ? {
        ...JSON.parse(result.map),
        sourcesContent: null,
      }
      : "",
  };
}
export default { process };
