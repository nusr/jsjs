var a = 'a';
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
