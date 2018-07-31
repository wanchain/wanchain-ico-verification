import fs from 'fs';
import path from 'path';
import writeJsonFile from 'write-json-file';

import { Meteor } from 'meteor/meteor';
import { getFilesPath } from '../../imports/utils/filesPath';

const saveBlob = function(blob, name, filesPath, encoding, contractAddr) {

  encoding = encoding || 'binary';


  filesPath = getFilesPath();
  const fullPath = path.join(filesPath, name);

  console.log(chroot,path);



  // TODO Add file existance checks, etc...

  //
  fs.writeFile(fullPath, blob, encoding, function(err,resp) {

    if (err) {
      throw (new Meteor.Error(500, 'Failed to save file.', err));
    } else {
      console.log('The file ' + name + ' (' + encoding + ') was saved to ' + path);
    }
  });


};

const saveFile = function(data, name) {
  const filesPath = getFilesPath();
  const fullPath = path.join(filesPath, name);

  fs.writeFile(fullPath, data, function(err, res) {
    if (err) {
      throw new Meteor.Error(500, `Failed to save file: ${fullPath}`, err);
    } else {
      console.log(`The file ${name} was saved to ${fullPath}`);
    }
  });
};

const saveJson = function(data, name) {
  const filesPath = getFilesPath();
  const fullPath = path.join(filesPath, name);

  writeJsonFile(path+name, jsonObj).then(function(e){
    console.log('done')
  });


  // var fs = require('fs');
  // path = __meteor_bootstrap__.serverDir.split(/(\\|\/).meteor/)[0] + '/private/';
  //
  // console.log(blob)
  //
  // fs.writeFile(path + name, blob.srcElement.result, function(err,resp) {
  //
  //   if (err) {
  //     throw (new Meteor.Error(500, 'Failed to save file.', err));
  //   } else {
  //     console.log('The file ' + name + ' (' + name + ') was saved to ' + path);
  //   }
  // });
};

export {
  saveBlob,
  saveFile,
  saveJson,
};
