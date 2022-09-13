import path from 'path';
import fs from 'fs';
import readline from 'readline';
import Jsjs from './jsjs';
import Environment from './environment';
import type { LiteralType } from './type';
import type { ClassInstance } from './class';

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

export function run(
  data: string,
  env: Environment,
  log: ClassInstance | null = null,
): LiteralType {
  const instance = new Jsjs(data, env);
  if (log !== null) {
    instance.register('console', log);
  }
  const result = instance.run();
  return result;
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
    run(data, new Environment(null));
  });
}
function runPrompt() {
  const reader = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '> ',
  });
  reader.prompt();
  const env = new Environment(null);
  reader
    .on('line', (line) => {
      run(line, env);
      reader.prompt();
    })
    .on('close', () => {
      console.log('end !');
      process.exit(0);
    });
}
