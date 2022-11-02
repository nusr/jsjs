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

window.onload = function () {
  var editorContainer;
  const buttonDom = document.querySelector('#run');
  buttonDom!.addEventListener('click', () => {
    handleClick(editorContainer.getValue());
  });
  fetch('./testData.js')
    .then((data) => data.text())
    .then((data) => {
      editorContainer = monaco.editor.create(
        document.getElementById('container')!,
        {
          value: data,
          language: 'javascript',
        },
      );
    });
};
