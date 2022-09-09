var a = 'a';
/**
 * @param {number} x
 * @param {number} y
 */
function add(x, y) {
  return x + y;
}
var cond = add(1, 2 * 3);
log(cond);
if (cond) {
  a = 'b';
} else {
  a = 'c';
}
log(a);

function makeCounter() {
  var i = 0;
  function count() {
    i = i + 1;
    log(i);
  }

  return count;
}

var counter = makeCounter();
counter();
counter();
var n = 1;
++n;
log(n);
--n;
log(n);
function fib(n) {
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2);
}
log(fib(30));
var globalA = 'global';
{
  function showA() {
    log(globalA);
  }

  showA();
  var globalA = 'block';
  showA();
}
class Test {
  b = 5;
  print(a) {
      log(a);
  }
}
var b = new Test();
b.print(3);
log(b.b);
b.b = '9';
log(b.b);
b.print = '1';
log(b.print);
var c = new Test();
log(c.b);
c.print(4);
