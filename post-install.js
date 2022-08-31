"use strict";
const fs = require("fs");
const path = require("path");
const { exec } = require('child_process');

function init() {
    const dir = path.join(process.cwd(), 'scripts')

    fs.readdir(dir, (error, list) => {
        if (error) {
            console.log(error);
            return;
        }
        for (const item of list) {
            const ext = path.extname(item);
            const filePath = path.join(dir, item);
            if (ext === '.js') {
                fs.unlink(filePath, error => {
                    if (error) {
                        console.log(error);
                    }
                })
            } else if (ext === '.ts') {
                exec(`npx esbuild ${filePath} --outfile=${filePath.replace('.ts', '.js')} --format=cjs`, error => {
                    if (error) {
                        console.log(error);
                    }
                })
            }
        }
    })
}

init();
