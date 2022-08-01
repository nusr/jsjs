import path from 'path';
import fs from 'fs';
import jsonData from './test.json';

type ResultItem = {
  time: string;
  total: number;
  fail: number;
  expectTotal: number;
  expectFail: number;
};

const jsonFilePath = path.join(process.cwd(), 'scripts', 'test.json');
const { Lox, globalExpect, Environment } = require('../lib/lox.umd');

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

function runFile(filePath) {
  const temp = path.resolve(process.cwd(), filePath);
  const data = fs.readFileSync(temp, 'utf-8');
  return new Lox().run(data, new Environment(null));
}

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
  const dirPath = path.join(process.cwd(), testDir);
  const fileList = getAllFiles(dirPath);
  let total = 0;
  let fail = 0;
  const blackList = ['benchmark', 'return_inside'];
  for (const item of fileList) {
    if (blackList.some((v) => item.includes(v))) {
      console.log('skip file path: ', item);
      continue;
    }
    let t = process.hrtime();
    try {
      runFile(item);
    } catch (error) {
      console.log(item, error);
      fail++;
    }
    t = process.hrtime(t);
    const ms = t[0] * 1e3 + Math.floor(t[1] / 1e6);
    console.log(`file path: ${item}, time: ${ms}ms`);
    total++;
  }
  const result: ResultItem = {
    time: new Date().toLocaleString('en'),
    total,
    fail,
    expectTotal: globalExpect.total,
    expectFail: globalExpect.total - globalExpect.success,
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
