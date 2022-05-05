const fs = require('fs');
const path = require('path');

function getSourceFiles(dir) {
  const files = fs.readdirSync(dir);
  const cFiles = [];
  for (const item of files) {
    const ext = path.extname(item);
    if (ext === '.c') {
      cFiles.push(item);
    }
  }
  return cFiles;
}

function getCMD(sourceFiles, dir, isDebug, cmd = '') {
  const paramsList = [];
  const params = ` -std=c99 -Wall -Wextra -Wno-unused-parameter -g ${cmd} `;
  const objDir = path.resolve(dir, '../build', isDebug ? 'debug' : 'release');
  for (const item of sourceFiles) {
    const file = path.resolve(dir, item);
    const objPath = path.resolve(objDir, item.slice(0, -2) + '.o');
    const temp = `gcc ${params} -c ${file} -o ${objPath}`;
    paramsList.push({
      cmd: temp,
      obj: objPath,
    });
  }
  const objList = paramsList.map((item) => item.obj).join(' ');
  const cmdList = paramsList.map((item) => item.cmd);
  const exe = path.resolve(objDir, 'clox.exe');
  cmdList.push(`gcc -o ${path.resolve(exe)} ${objList}`);
  cmdList.push(exe);
  return cmdList.join('\n');
}

function makeDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
}

function init() {
  const buildDir = path.resolve(__dirname, '../build');
  fs.rmdirSync(buildDir, { recursive: true });
  makeDir(buildDir);
  makeDir(path.resolve(buildDir, 'debug'));
  makeDir(path.resolve(buildDir, 'release'));
  const dir = path.resolve(__dirname, '../c');
  const sourceFiles = getSourceFiles(dir);
  const cmd = getCMD(sourceFiles, dir, true, '');
  fs.writeFileSync(path.resolve(__dirname, '../windows.cmd'), cmd, 'utf-8');
}
init();
