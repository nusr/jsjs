import path from 'path';
import fs from 'fs';
import readline from 'readline';
import { interpret } from './jsjs';
import EnvironmentImpl from './environment';
import { registerGlobal } from './native';

export function init() {
  const args = process.argv;
  if (args.length > 3) {
    console.log('Usage: [filepath]]');
    process.exit(64);
  } else if (args.length === 3 && args[2]) {
    runFile(args[2]);
  } else {
    runPrompt();
  }
}

function runFile(filePath: string) {
  let temp = filePath;
  if (!path.isAbsolute(filePath)) {
    temp = path.resolve(process.cwd(), filePath);
  }
  fs.readFile(temp, 'utf-8', (error, data) => {
    if (error) {
      return;
    }
    const env = new EnvironmentImpl(null);
    registerGlobal(env);
    interpret(data, env);
  });
}
function runPrompt() {
  const reader = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '> ',
  });
  reader.prompt();
  const env = new EnvironmentImpl(null);
  registerGlobal(env);
  reader
    .on('line', (line) => {
      interpret(line, env);
      reader.prompt();
    })
    .on('close', () => {
      console.log('end !');
      process.exit(0);
    });
}
