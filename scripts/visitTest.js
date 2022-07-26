const fs = require('fs');
const path = require('path');
const { Lox, globalExpect, Environment } = require('../lib/lox.umd');

const getAllFiles = (dirPath, fileList = [], index = 0) => {
  files = fs.readdirSync(dirPath);
  for (const file of files) {
    if (fs.statSync(dirPath + '/' + file).isDirectory()) {
      fileList = getAllFiles(dirPath + '/' + file, fileList, index + 1);
    } else {
      fileList.push(path.join(dirPath, '/', file));
    }
  }
  return fileList;
};
const testDir = process.argv[2] || 'test';
const dirPath = path.join(process.cwd(), testDir);
const fileList = getAllFiles(dirPath);
const failList = [];
function runFile(filePath) {
  const temp = path.resolve(process.cwd(), filePath);
  const data = fs.readFileSync(temp, 'utf-8');
  return new Lox().run(data, new Environment(null));
}

for (const item of fileList) {
  try {
    runFile(item);
  } catch (error) {
    failList.push(item);
  }
}
const result = {
  time: new Date().toLocaleString('en'),
  total: fileList.length,
  fail: failList.length,
  fail: failList.length,
  expectTotal: globalExpect.total,
  expectFail: globalExpect.total - globalExpect.success,
};
console.log(result);
if (testDir === 'test') {
  const jsonFilePath = path.join(process.cwd(), 'scripts', 'test.json');
  const jsonData = require(jsonFilePath);
  jsonData.unshift(result);
  fs.writeFile(
    jsonFilePath,
    JSON.stringify(jsonData, null, 2),
    'utf-8',
    (error) => {
      if (error) {
        console.log(error);
      }
    },
  );
}
