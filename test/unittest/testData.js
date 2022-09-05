var a = "a";
/**
 * @param {number} x
 * @param {number} y
 */
function add(x, y) {
  return x + y;
}
var cond = add(1, 2 * 3);
cond;
if (cond) {
  a = "b";
} else {
  a = "c";
}
a;

function makeCounter() {
  var i = 0;
  function count() {
    i = i + 1;
    return i;
  }

  return count;
}

var counter = makeCounter();
counter();
counter();
var n = 1;
++n;
--n;
// function fib(n) {
//   if (n <= 1) {
//     return 1;
//   }
//   return fib(n - 1) + fib(n - 2);
// }
// fib(4);
/* var a = "global";
{
  function showA() {
    console.log(a)
  }
+
  showA();
  var a = "block";
  showA();
} */