import { Environment, interpret, getGlobalObject } from '../../src/index';
import { LiteralType } from '../../src/type';

const inputData = `var a = 'a';
/**
 * @param {number} x
 * @param {number} y
 */
function add(x, y) {
  return x + y;
}
var cond = add(1, 2 * 3);
console.log(cond);
if (cond) {
  a = 'b';
} else {
  a = 'c';
}
console.log(a);

function makeCounter() {
  var i = 0;
  function count() {
    i = i + 1;
    console.log(i);
  }

  return count;
}

var counter = makeCounter();
counter();
counter();
var n = 1;
++n;
console.log(n);
--n;
console.log(n);
function fib(n) {
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2);
}
console.log(fib(30));
var globalA = 'global';
{
  function showA() {
    console.log(globalA);
  }

  showA();
  var globalA = 'block';
  showA();
}
class Test {
  b = 5;
  print(a) {
      console.log(a);
  }
}
var b = new Test();
b.print(3);
console.log(b.b);
b.b = '9';
console.log(b.b);
b.print = '1';
console.log(b.print);
var c = new Test();
console.log(c.b);
c.print(4);
`;

describe('interpreter.test.ts', () => {
  test('interpreter', () => {
    let resultList: LiteralType[][] = [];
    const env = new Environment(null);
    const log = getGlobalObject({
      log(...result: LiteralType[]) {
        resultList.push(result);
      },
      error() {},
    });
    env.define('console', log.console);
    interpret(inputData, env);
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
});
