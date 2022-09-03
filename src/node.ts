import path from 'path'
import fs from 'fs'
import readline from 'readline'
import Jsjs from './jsjs';
import Environment from './environment' 

function init() {
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
        new Jsjs().run(data, new Environment(null));
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
            new Jsjs().run(line, env);
            reader.prompt();
        })
        .on('close', () => {
            console.log('end !');
            process.exit(0);
        });
}
init();