import fs from 'fs';
import path from 'path';
import readline from 'readline';
import Scanner from './scanner';
import { defaultErrorHandler } from './error';

class Lox {
  constructor() {
    const args = process.argv;
    console.log(args);
    if (args.length > 3) {
      console.log('Usage: filepath');
      process.exit(64);
    } else if (args.length === 3) {
      this.runFile(args[2]);
    } else {
      this.runPrompt();
    }
  }
  static error(line: number, message: string) {
    Lox.report(line, '', message);
  }
  static report(line: number, where: string, message: string) {
    console.log(`[line ${line}] Error ${where} : ${message} `);
  }
  private runPrompt() {
    const reader = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: 'Lox> ',
    });
    reader.prompt();
    reader
      .on('line', (line) => {
        this.run(line);
        defaultErrorHandler.set(false);
        reader.prompt();
      })
      .on('close', () => {
        console.log('end Lox!');
        process.exit(0);
      });
  }
  private runFile(filePath: string) {
    const temp = path.resolve(process.cwd(), filePath);
    fs.readFile(temp, 'utf-8', (error, data) => {
      if (error) {
        defaultErrorHandler.error(0, error.stack || error.message);
        return;
      }
      this.run(data);
      if (defaultErrorHandler.get()) {
        process.exit(65);
      }
    });
  }
  private run(text: string) {
    const scanner = new Scanner(text);
    const tokens = scanner.scanTokens();
    for (const item of tokens) {
      console.log(item);
    }
  }
}

export default Lox;
