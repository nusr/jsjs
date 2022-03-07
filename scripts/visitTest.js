const fs = require('fs');
const path = require('path');
const Lox = require('../lib/lox.umd').Lox;
const jsonFilePath = path.join(process.cwd(), 'scripts', 'test.json');
const jsonData = require(jsonFilePath);

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
jsonData.unshift({
  time: new Date().toLocaleString('en'),
  total: fileList.length,
  success: successList.length,
  fail: failList.length,
});
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
