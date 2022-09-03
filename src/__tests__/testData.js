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