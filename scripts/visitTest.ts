import path from 'path';
import fs from 'fs';
import jsonData from './test.json';
import { execFileSync } from 'child_process';

type ResultItem = {
  time: string;
  total: number;
  fail: number;
};

const jsonFilePath = path.join(process.cwd(), 'scripts', 'test.json');

const getAllFiles = (dirPath: string, fileList: string[] = [], index = 0) => {
  const files = fs.readdirSync(dirPath);
  for (const file of files) {
    if (fs.statSync(dirPath + '/' + file).isDirectory()) {
      fileList = getAllFiles(dirPath + '/' + file, fileList, index + 1);
    } else {
      fileList.push(path.join(dirPath, '/', file));
    }
  }
  return fileList;
};
function checkEqual(oldData, newData, excludeKeys) {
  if (!oldData || !newData) {
    return false;
  }
  for (const key of Object.keys(oldData)) {
    if (excludeKeys.includes(key)) {
      continue;
    }
    if (oldData[key] !== newData[key]) {
      return false;
    }
  }
  return true;
}

function init() {
  const testDir = process.argv[2] || 'test';
  const prefix = process.cwd();
  const dirPath = path.join(prefix, testDir);
  const fileList = getAllFiles(dirPath);
  let fail = 0;
  for (let i = 0; i < fileList.length; i++) {
    const item = fileList[i];
    try {
      execFileSync('node', [`${prefix}/lib/lox.node.js`, item], {
        timeout: 1000,
        env: {
          ...process.env,
          NODE_ENV: 'test',
        }
      });
    } catch (error) {
      fail++;
      console.log('fail file path: ', item);
    }
  }
  const result: ResultItem = {
    time: new Date().toLocaleString('en'),
    total: fileList.length,
    fail,
  };
  console.log('old: ', jsonData[0]);
  console.log('new: ', result);
  if (testDir === 'test' && !checkEqual(result, jsonData[0], ['time'])) {
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
}

init();
