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
      name: 'primary',
      input: `
      console.log(undefined)
      console.log(null)
      console.log(1)
      console.log(1.0)
      console.log(true)
      console.log(false)
      console.log('str')
      console.log("str")`,
      expect: [undefined, null, 1, 1.0, true, false, 'str', 'str'],
    },
    {
      name: 'binary operator',
      input: `
        console.log((0.1 + 0.2) == 0.3)
        console.log(undefined == null)
        console.log(undefined === null)
        console.log(1 >= 2);
        console.log(1 <= 2);
        console.log(3.0 > 2)
        console.log('a' < 'b')
      `,
      expect: [false, true, false, false, true, true, true],
    },
    {
      name: 'exponentiation',
      input: `
      console.log(2 ** 3 ** 2)
      console.log((2 ** 3) ** 2)
      `,
      expect: [512, 64],
    },
    {
      name: 'unary',
      input: `
      console.log(~3)
      console.log(~-3)
      console.log(~~3.2)
      `,
      expect: [-4, 2, 3],
    },
    {
      name: 'bitwise',
      input: `
      console.log(3 | 5)
      console.log(3 & 5)
      console.log(3 ^ 5)
      `,
      expect: [7, 1, 6],
    },
    {
      name: 'bitwise shift',
      input: `
        console.log(2 << 5)
        console.log(2323 >> 2)
        console.log(-9 >>> 2)
      `,
      expect: [64, 580, 1073741821],
    },
    {
      name: 'logical operator',
      input: `
        console.log(true && false)
        console.log(true && true)
        console.log(true || false)
        console.log(false || false)
      `,
      expect: [false, true, true, false],
    },
    {
      name: 'unicode',
      input: `
      var 变量 = 2
      console.log(变量) // chinese
      变量 = "变量"
      console.log(变量)
      var 變量 = '變量'
      console.log(變量)
      /*
      japanese
      */
      var 変数 = '変数'
      console.log(変数)
      `,
      expect: [2, '变量', '變量', '変数'],
    },
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
      console.log(a);
      a = 1;
      a <<= 3;
      console.log(a);
      a >>= 1;
      console.log(a);
      a >>>= 1;
      console.log(a);
      a **= 2
      console.log(a)
      a |= 3
      console.log(a)
      a ^= 2
      console.log(a)
      a &= 4
      console.log(a)
      `,
      expect: [2, 4, 2, 1, 1, 0, 8, 4, 2, 4, 7, 5, 4],
    },
    {
      name: 'for',
      input: `
      for (var a = 1; a <= 3; ++a) {
        console.log(a)
      }
      var i = 4;
      for (; i < 6; ) {
        console.log(i);
        ++i;
      }
      `,
      expect: [1, 2, 3, 4, 5],
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
      name: 'array',
      input: `
      var arr = function() {
        return [1,2,3.0, 'test']
      }
      console.log(arr()[0])
      console.log(arr()[2])
      console.log(arr().length)
      console.log([4,5,6][1])
      `,
      expect: [1, 3.0, 4, 5],
    },
    {
      name: 'object',
      input: `
        var obj = {}
        console.log(obj.a)
        obj.a = 4
        console.log(obj['a'])
        console.log(obj.a)
        var obj2 = {
          a: {
            c: 1,
          },
          b: 2,
        }
        console.log(obj2.a.c)
        obj2.a.c = obj2.b
        console.log(obj2.a.c)
      `,
      expect: [undefined, 4, 4, 1, 2],
    },
    {
      name: 'function',
      input: `
        function add(a,b) {
          return a + b;
        }
        console.log(add('2'))
        console.log(add(2))
        console.log(add(1, 2))
        console.log(add(1, 2, 3))
        function returnData() {
          return;
        }
        console.log(returnData())
        `,
      expect: ['2undefined', NaN, 3, 3, undefined],
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
      Test.a = 'test';
      console.log(Test.a);
      Test.a = function () {
        console.log('print')
      }
      Test.a();
      `,
      expect: [1, 2, 'test', 'print'],
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
    {
      name: 'class extends',
      input: `
      class Animal {
        constructor(name) {
          this.name = name;
        }
        getName() {
          return this.name;
        }
      }
      
      class Dog extends Animal{
        constructor(name) {
          super(name);
        }
        getName() {
          return 'dog ' + this.name;
        }
      }
      
      var dog = new Dog("steve")
      var animal = new Animal('dog')
      console.log(dog.getName())
      console.log(animal.getName())
      console.log(animal.name)
      console.log(dog.name)
      `,
      expect: ['dog steve', 'dog', 'dog', 'steve'],
    },
    {
      name: 'class expression',
      input: `
      var Rectangle = class {
        constructor(height, width) {
          this.height = height;
          this.width = width;
        }
        area() {
          return this.height * this.width;
        }
      };
      var instance = new Rectangle(5, 8);
      console.log(instance.area());
      `,
      expect: [40],
    },
    {
      name: 'function expression',
      input: `
      (function add(a){
        console.log(a)
      })(3);
      var add = function(x,y){
        return x + y;
      }
      console.log(add(1,3))`,
      expect: [3, 4],
    },
    {
      name: 'function expression self',
      input: `console.log((function fib(n) {
        if (n <= 1) return n;
        return fib(n - 1) + fib(n - 2);
      })(20))`,
      expect: [6765],
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
