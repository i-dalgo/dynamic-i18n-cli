'use-strict';
const fs = require('fs');
const path = require('path');

function isObject (obj) {
  return obj !== null && typeof obj === 'object';
}

function checkInstalled (target) {
  let ret = true;
  try {
    const resolveModule = require(path.resolve(target));
    if (!resolveModule) {
      ret = false;
    }
  } catch (e) {
    ret = false;
  }
  return ret;
}

function exists (path) {
  let ret = true;
  try {
    fs.accessSync(path, fs.constants.F_OK);
  } catch (e) {
    ret = false;
  }
  return ret;
}

function mkdir (path) {
  let ret = true;
  try {
    fs.mkdirSync(path);
  } catch (e) {
    ret = false;
  }
  return ret;
}

function writeFile (path, content) {
  let ret = true;
  try {
    fs.writeFileSync(path, content, { encoding: 'utf8' });
  } catch (e) {
    ret = false;
  }
  return ret;
}

function readFile (path) {
  let ret = '';
  try {
    ret = fs.readFileSync(path, { encoding: 'utf8' });
  } catch (e) {
    ret = '';
  }
  return ret;
}

function sortObject (obj, order = 'asc') {
  const keys = Object.keys(obj);
  const sortedKeys = order === 'asc' ? keys.sort() : keys.reverse();
  return sortedKeys.reduce((val, key) => {
    const v = obj[key];
    if (isObject(v)) {
      val[key] = sortObject(v, order);
    } else if (Array.isArray(v)) {
      val[key] = order === 'asc' ? v.sort() : v.reverse();
    } else {
      val[key] = v;
    }
    return val;
  }, {});
}

function getFilesName (targetPath, extension = 'json') {
  return fs.readdirSync(targetPath).map(locale => {
    const reg = new RegExp(extension);
    if (locale.match(reg)) {
      return path.basename(locale, `.${extension}`);
    }
  }).filter(el => el);
}

module.exports = {
  isObject,
  checkInstalled,
  exists,
  mkdir,
  writeFile,
  readFile,
  sortObject,
  getFilesName
}
