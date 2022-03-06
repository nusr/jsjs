import Lox from '.';
import eventEmitter from './EventEmitter';

const lox = new Lox();
const dom = document.querySelector<HTMLTextAreaElement>('#code');
const button = document.querySelector<HTMLButtonElement>('#run');
const result = document.querySelector<HTMLSpanElement>('#result');

eventEmitter.on('print', (data) => {
  if (result) {
    const time = new Date().toLocaleString();
    result.innerHTML =
      result.innerHTML +
      `<div>time: ${time}, result: ${
        data.value
      }, type: ${typeof data.value}</div>`;
  }
});

if (button) {
  const localKey = 'local_key';
  window.localStorage.setItem('debug', '*');
  const temp = localStorage.getItem(localKey);
  if (temp && dom) {
    dom.value = temp;
    lox.run(temp);
  }
  button.addEventListener('click', () => {
    const text = dom?.value || '';
    lox.run(text);
    localStorage.setItem(localKey, text);
  });
}
