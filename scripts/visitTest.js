const fs = require('fs');
const path = require('path');
const Lox = require('../lib/index.js').default;

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
const dirPath = path.join(__dirname, '../test');
const fileList = getAllFiles(dirPath);
const failList = [];
const successList = [];
const lox = new Lox();
function runFile(filePath) {
  const temp = path.resolve(process.cwd(), filePath);
  const data = fs.readFileSync(temp, 'utf-8');
  return lox.run(data);
}
// console.log(dirPath, fileList);
for (const item of fileList) {
  try {
    runFile(item);
    successList.push(item);
  } catch (error) {
    failList.push(item);
  }
}
console.log(
  `total: ${fileList.length}, success: ${successList.length}, fail: ${failList.length}`,
);
