import path from 'path'
import fs from 'fs'
import readline from 'readline'
const { Lox, defaultErrorHandler, Environment } = require('../lib/lox.umd');

function init() {
    const args = process.argv;
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
    let temp = filePath;
    if (!path.isAbsolute(filePath)) {
        temp = path.resolve(process.cwd(), filePath);
    }
    fs.readFile(temp, 'utf-8', (error, data) => {
        if (error) {
            defaultErrorHandler.error(0, error.stack || error.message);
            return;
        }
        new Lox().run(data, new Environment(null));
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
    const env = new Environment(null);
    reader
        .on('line', (line) => {
            new Lox().run(line, env);
            defaultErrorHandler.reset();
            reader.prompt();
        })
        .on('close', () => {
            console.log('end Lox!');
            process.exit(0);
        });
}
init();
