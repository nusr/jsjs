import { Environment, Jsjs } from '../../src/index';
import * as fs from 'fs';
import * as path from 'path';

let inputData = '';
beforeAll(() => {
  inputData = fs.readFileSync(path.join(__dirname, 'testData.js'), 'utf-8');
});

describe('parser.test.ts', () => {
  test('parser', () => {
    const env = new Environment(null);
    const jsjs = new Jsjs();
    const result = jsjs.run(inputData, env);
    expect(result).toEqual([
      null,
      null,
      null,
      7,
      null,
      'b',
      null,
      null,
      1,
      2,
      null,
      2,
      1,
    ]);
  });
});
