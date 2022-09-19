import * as path from 'path';

const rootDir = process.cwd();
const transformPath = path.join(__dirname, "transform.js");
export default {
  rootDir,
  transform: {
    "^.+\\.tsx?$": transformPath,
  },
  collectCoverageFrom: [
    "**/src/*.ts",
    "!**/src/type.ts",
  ],
  coverageReporters: [
    "json",
    "lcov",
    "text",
    "clover",
    "html",
    "json-summary",
    "html-spa",
  ],
};
