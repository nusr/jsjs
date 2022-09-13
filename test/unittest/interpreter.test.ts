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
      [3],
      [5],
      ['9'],
      ['1'],
      [5],
      [4],
    ]);
  });
  const list: Array<{ input: string; expect: LiteralType[]; name: string }> = [
    {
      name: 'if return',
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
      name: 'while return',
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
      name: 'do while',
      input: `
      var a = 3;
      do { 
        log(a);
        --a;
      } while(a > 0)`,
      expect: [3, 2, 1],
    },
    {
      name: 'class',
      input: `
      function test() {
        log('test');
      }
      class Test {
        b = 5;
        c = test();
        print(a) {
            log(a);
        }
      }
      var a = new Test();
      a.print(3);
      log(a.b);
      a.b = '9';
      log(a.b);
      a.print = '1';
      log(a.print);
      var c = new Test();
      log(c.b);
      c.print(4);`,
      expect: ['test', 3, 5, '9', '1', 'test', 5, 4],
    },
    {
      name: 'class static',
      input: `
      function test(){
        return 1;
      }
      class Test {
        static a = test();
        static print(a) {
          log(a);
        }
      }
      log(Test.a);
      Test.print(2);
      `,
      expect: [1, 2],
    },
    {
      name: 'class this',
      input: `
      class Test {
        constructor(a,b) {
          this.a = a;
          this.b = b;
        }
        print() {
          log(this.a);
        }
      }
      var a = new Test(1,2);
      log(a.a);
      log(a.b);
      a.a = 3;
      a.print();
      `,
      expect: [1, 2, 3],
    },
  ];
  for (const item of list) {
    test(item.name, () => {
      const env = new Environment(null);
      const jsjs = new Jsjs(item.input, env);
      const log = new Log();
      log.log = (result: LiteralType[]) => {
        expect(result[0]).toEqual(item.expect.shift());
      };
      jsjs.register('log', log);
      jsjs.run();
    });
  }
});
