type LiteralType = any;
interface Environment {
  new (env: Environment | null): this;
}
interface Jsjs {
  new (text: string, env: Environment): this;
  errors: string[];
  run(): LiteralType;
  register(name: string, value: LiteralType): void;
}
interface Log {
  new (): this;
  log(result: LiteralType[]): void;
}

interface Window {
  jsjs: {
    Environment: Environment;
    Jsjs: Jsjs;
    Log: Log;
  };
}

function handleClick() {
  const textareaDom = document.querySelector<HTMLTextAreaElement>('#code');
  const resultDom = document.querySelector<HTMLDivElement>('#result');
  const text = textareaDom!.value;
  if (!text) {
    return;
  }
  const { Jsjs, Environment, Log } = window.jsjs;
  const interpreter = new Jsjs(text, new Environment(null));
  const log = new Log();
  log.log = (result) => {
    console.log(...result);
    resultDom!.innerHTML += result
      .map((item) => `<div>log: ${item}</div>`)
      .join('');
  };
  interpreter.register('log', log);
  const result = interpreter.run();
  if (interpreter.errors.length > 0) {
    resultDom!.innerHTML =
      interpreter.errors.map((item) => `<div>error: ${item}</div>`).join('') +
      resultDom!.innerHTML;
  } else {
    console.log(result);
  }
}
window.onload = function () {
  const buttonDom = document.querySelector('#run');
  buttonDom!.addEventListener('click', handleClick);
};
