import * as monaco from 'monaco-editor/esm/vs/editor/editor.main.js';

type LiteralType = any;
interface Environment {
  new (env: Environment | null): this;
}
interface Jsjs {
  new (text: string, env: Environment): this;
  run(): LiteralType;
  register(name: string, value: LiteralType): void;
}

interface GlobalWindow {
  originEditorData: string;
  jsjs: {
    Environment: Environment;
    Jsjs: Jsjs;
    getGlobalObject: (
      params: Pick<Console, 'log' | 'error'>,
    ) => Record<string, Record<LiteralType, LiteralType>>;
  };
	MonacoEnvironment: {
		getWorkerUrl: (moduleId: string, label: string) => string;
	}
}

var logCount = 1;

function handleClick(text: string) {
  const resultDom = document.querySelector<HTMLDivElement>('#result');
  if (!text) {
    return;
  }
  const { Jsjs, Environment, getGlobalObject } = (
    window as unknown as GlobalWindow
  ).jsjs;
  const interpreter = new Jsjs(text, new Environment(null));
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
    interpreter.register(key, temp[key]);
  }
  const result = interpreter.run();
  console.log(result);
}

(window as unknown as GlobalWindow).MonacoEnvironment = {
  getWorkerUrl: function (moduleId, label) {
    if (label === 'typescript' || label === 'javascript') {
      return './vs/language/typescript/ts.worker.js';
    }
    return './vs/editor/editor.worker.js';
  },
};

window.onload = function () {
  const editorContainer = monaco.editor.create(
    document.getElementById('container')!,
    {
      value: (window as unknown as GlobalWindow).originEditorData,
      language: 'javascript',
    },
  );
  const buttonDom = document.querySelector('#run');
  buttonDom!.addEventListener('click', () => {
    handleClick(editorContainer.getValue());
  });
};
