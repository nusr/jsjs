const fs = require('fs');
const path = require('path');
const { runFile } = require('../lib/node.js');

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
// console.log(dirPath, fileList);
for (const item of fileList) {
  runFile(item);
}
