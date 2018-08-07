import fs from 'fs';
import path from 'path';
import writeJsonFile from 'write-json-file';

import { Meteor } from 'meteor/meteor';
import getFilesPath from '../../imports/utils/filesPath';

const saveFile = function(data, name) {
  const filesPath = getFilesPath();
  const fullPath = path.join(filesPath, name);

  return new Promise((resolve, reject) => {
    fs.writeFile(fullPath, data, function(err, res) {
      if (err) {
        console.log(`Failed to save file: ${fullPath}`, err);
        reject(new Meteor.Error(500, `Failed to save file: ${fullPath}`, err));
      } else {
        console.log(`The file ${name} was saved to ${fullPath}`);
        resolve(res);
      }
    });
  });
};

const saveFileWithEncoding = function(data, name, encoding) {
  encoding = encoding || 'binary';

  const filesPath = getFilesPath();
  const fullPath = path.join(filesPath, name);

  return new Promise((resolve, reject) => {
    fs.writeFile(fullPath, data, encoding, function(err, res) {
      if (err) {
        console.log(`Failed to save file: ${fullPath}`, err);
        reject(new Meteor.Error(500, `Failed to save file: ${fullPath}`, err));
      } else {
        console.log(`The file ${name} (${encoding}) was saved to ${fullPath}`);
        resolve(res);
      }
    });
  });
};

const saveJson = function(data, name) {
  const filesPath = getFilesPath();
  const fullPath = path.join(filesPath, name);

  return new Promise((resolve, reject) => {
    writeJsonFile(fullPath, data).then(function(res) {
      console.log('JSON file saved', fullPath);
      resolve();
    }).catch(err => {
      console.log('Error saving JSON file', err);
      reject(err);
    });
  });
};

export {
  saveFile,
  saveFileWithEncoding,
  saveJson,
};
