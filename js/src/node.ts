import fs from 'fs';
import readline from 'readline';
import Lox from './index';
import path from 'path';
import { defaultErrorHandler } from './error';

const lox = new Lox();
function init() {
  const args = process.argv;
  console.log(args);
  if (args.length > 3) {
    console.log('Usage: lox [filepath]]');
    process.exit(64);
  } else if (args.length === 3 && args[2]) {
    runFile(args[2]);
  } else {
    runPrompt();
  }
}

function runFile(filePath: string) {
  const temp = path.resolve(process.cwd(), filePath);
  fs.readFile(temp, 'utf-8', (error, data) => {
    if (error) {
      defaultErrorHandler.error(0, error.stack || error.message);
      return;
    }
    lox.run(data);
    if (defaultErrorHandler.get()) {
      process.exit(65);
    }
  });
}
function runPrompt() {
  const reader = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'Lox> ',
  });
  reader.prompt();
  reader
    .on('line', (line) => {
      lox.run(line);
      defaultErrorHandler.reset();
      reader.prompt();
    })
    .on('close', () => {
      console.log('end Lox!');
      process.exit(0);
    });
}

export { init, runFile, runPrompt };
