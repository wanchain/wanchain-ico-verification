import { Meteor } from 'meteor/meteor';
import { saveBlob, saveFile, saveJson } from '../../imports/files/saveFile';
import { createTar } from '../../imports/files/createTar';

Meteor.methods({
  saveBlob,
  saveFile,
  saveJson,
  createTar,
});

// function cleanPath(str) {
//   if (str) {
//     return str.replace(/\.\./g,'').replace(/\/+/g,'').
//     replace(/^\/+/,'').replace(/\/+$/,'');
//   }
// }

// function cleanName(str) {
//   return str.replace(/\.\./g,'').replace(/\//g,'');
// }
