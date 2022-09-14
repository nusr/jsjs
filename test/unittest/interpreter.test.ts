import { Environment, Jsjs, getGlobalObject } from '../../src/index';
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
    const log = getGlobalObject({
      log(...result: LiteralType[]) {
        resultList.push(result);
      },
      error() {},
    });
    jsjs.register('console', log.console);
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
      name: 'assignment equal',
      input: `
      var a = 1;
      a += 1;
      console.log(a);
      a *= 2;
      console.log(a);
      a /= 2;
      console.log(a);
      a -= 1;
      console.log(a);
      a ||= 4;
      console.log(a);
      a &&= 0;
      console.log(a);`,
      expect: [2, 4, 2, 1, 1, 0],
    },
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
      console.log(ifReturn(20));
      console.log(ifReturn(2));`,
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
      console.log(whileReturn(2));
      console.log(whileReturn(10));`,
      expect: [2, 5],
    },
    {
      name: 'do while',
      input: `
      var a = 3;
      do { 
        console.log(a);
        --a;
      } while(a > 0)`,
      expect: [3, 2, 1],
    },
    {
      name: 'class',
      input: `
      function test() {
        console.log('test');
      }
      class Test {
        b = 5;
        c = test();
        print(a) {
            console.log(a);
        }
      }
      var a = new Test();
      a.print(3);
      console.log(a.b);
      a.b = '9';
      console.log(a.b);
      a.print = '1';
      console.log(a.print);
      var c = new Test();
      console.log(c.b);
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
          console.log(a);
        }
      }
      console.log(Test.a);
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
          console.log(this.a);
        }
      }
      var a = new Test(1,2);
      console.log(a.a);
      console.log(a.b);
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

      const log = getGlobalObject({
        log(...result: LiteralType[]) {
          expect(result[0]).toEqual(item.expect.shift());
        },
        error() {},
      });
      jsjs.register('console', log.console);
      jsjs.run();
    });
  }
});
