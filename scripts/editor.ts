import * as monaco from 'monaco-editor/esm/vs/editor/editor.main.js';

type LiteralType = any;
interface Environment {
  new (env: Environment | null): this;
  get(name: string): LiteralType;
  define(name: string, value: LiteralType): LiteralType;
  assign(name: string, value: LiteralType): LiteralType;
}

interface GlobalWindow {
  jsjs: {
    Environment: Environment;
    interpret(text: string, environment: Environment): LiteralType;
    getGlobalObject: (
      params: Pick<Console, 'log' | 'error'>,
    ) => Record<string, Record<LiteralType, LiteralType>>;
  };
  MonacoEnvironment: {
    getWorkerUrl: (moduleId: string, label: string) => string;
  };
}

var logCount = 1;

function handleClick(text: string) {
  const resultDom = document.querySelector<HTMLDivElement>('#result');
  if (!text) {
    return;
  }
  const { interpret, Environment, getGlobalObject } = (
    window as unknown as GlobalWindow
  ).jsjs;
  const env = new Environment(null);
  const temp = getGlobalObject({
    log(...result: LiteralType[]) {
      console.log(...result);
      resultDom!.innerHTML += result
        .map((item) => {
          const style = typeof item === 'number' ? `style="color:blue;"` : '';
          const text = `<div>${logCount++}: <span ${style}>${item}</span></div>`;
          return text;
        })
        .join('');
    },
    error() {},
  });
  for (const key of Object.keys(temp)) {
    env.define(key, temp[key]);
  }
  const result = interpret(text, env);
  console.log(result);
}

(window as unknown as GlobalWindow).MonacoEnvironment = {
  getWorkerUrl: function (moduleId: string, label: string) {
    if (label === 'typescript' || label === 'javascript') {
      return './vs/language/typescript/ts.worker.js';
    }
    return './vs/editor/editor.worker.js';
  },
};

const testData = `var a = 'a';
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

window.onload = function () {
  const editorContainer = monaco.editor.create(
    document.getElementById('container')!,
    {
      value: testData,
      language: 'javascript',
    },
  );

  const buttonDom = document.querySelector('#run');
  buttonDom!.addEventListener('click', () => {
    handleClick(editorContainer.getValue());
  });
};
