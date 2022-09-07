import { run } from '../../src/node';
import { Environment, Log } from '../../src/index';
import * as fs from 'fs';
import * as path from 'path';
import { LiteralType } from '../../src/type';

let inputData = '';
beforeAll(() => {
  inputData = fs.readFileSync(path.join(__dirname, 'testData.js'), 'utf-8');
});

describe('node.test.ts', () => {
  test('node interpreter', () => {
    let resultList: LiteralType[][] = [];
    const env = new Environment(null);
    const log = new Log();
    log.log = (result: LiteralType[]) => {
      resultList.push(result);
    };
    run(inputData, env, log);

    expect(resultList).toEqual([
      [7],
      ['b'],
      [1],
      [2],
      [2],
      [1],
      [832040],
      ['global'],
      ['block'],
      [1]
    ]);
  });
});
