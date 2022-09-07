import { Environment, Jsjs, Log } from '../../src/index';
import * as fs from 'fs';
import * as path from 'path';
import { LiteralType } from '../../src/type';

let inputData = '';
beforeAll(() => {
  inputData = fs.readFileSync(path.join(__dirname, 'testData.js'), 'utf-8');
});

describe('interpreter.test.ts', () => {
  test('interpreter', () => {
    let resultList: LiteralType[][] = [];
    const env = new Environment(null);
    const jsjs = new Jsjs(inputData, env);
    const log = new Log();
    log.log = (result: LiteralType[]) => {
      resultList.push(result);
    };
    jsjs.register('log', log);
    jsjs.run();
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
    ]);
  });
  test('other', () => {
    const list: Array<{ input: string; expect: LiteralType[] }> = [
      {
        input: `
        function ifReturn(a) {
            if (a > 10) {
                return a - 1;
            } else {
                return a + 1;
            }
            return 10;
        }
        log(ifReturn(20));
        log(ifReturn(2));`,
        expect: [19, 3],
      },
      {
        input: `
        function whileReturn(n) {
            while(1) {
                if (n <= 5) {
                    return n;
                }
                --n;
            }
            return 0;
        }
        log(whileReturn(2));
        log(whileReturn(10));`,
        expect: [2, 5],
      },
      {
        input: `
      class Test {
          print() {
              log(1);
          }
      }
      var a = Test();
      a.print();`,
        expect: [1],
      },
    ];
    for (const item of list) {
      const env = new Environment(null);
      const jsjs = new Jsjs(item.input, env);
      const log = new Log();
      log.log = (result: LiteralType[]) => {
        expect(result[0]).toEqual(item.expect.shift());
      };
      jsjs.register('log', log);
      jsjs.run();
    }
  });
});
