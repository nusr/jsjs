import Lox from '.';

const lox = new Lox();
const dom = document.querySelector<HTMLTextAreaElement>('#code');
const button = document.querySelector<HTMLButtonElement>('#run');
const result = document.querySelector<HTMLSpanElement>('#result');
if (button) {
  button.addEventListener('click', () => {
    const temp = lox.run(dom?.value);
    if (result) {
      result.textContent = `result: ${temp}, type: ${typeof temp}`;
    }
  });
}
