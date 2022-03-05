import Lox from '.';
import eventEmitter from './EventEmitter';


const lox = new Lox();
const dom = document.querySelector<HTMLTextAreaElement>('#code');
const button = document.querySelector<HTMLButtonElement>('#run');
const result = document.querySelector<HTMLSpanElement>('#result');

eventEmitter.on('print', (data) => {
  if (result) {
    result.textContent = `result: ${data.value}, type: ${typeof data.value}`;
  }
});

if (button) {
  button.addEventListener('click', () => {
    lox.run(dom?.value);
  });
}
