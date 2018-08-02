import CryptoJS from 'crypto-js';

import { Meteor } from 'meteor/meteor';
import { RandomWord } from 'meteor/augustnagro:random-word';

export function createAccount(userData){
  userData.password = RandomWord.get()+RandomWord.get();

  var thePassword = Meteor.settings.env.password;

  var encrypted = CryptoJS.AES.encrypt(userData.password,thePassword);

  userData.profile.password = encrypted.toString();

  userData.profile.p = userData.password;

  console.log('encrypted',encrypted.toString());

  var decrypted  = CryptoJS.AES.decrypt(encrypted.toString(), thePassword).toString(CryptoJS.enc.Utf8);

  console.log('decrypted',decrypted);

  userData._id = Accounts.createUser(userData);

  return userData
}

export function decryptIt(encrypted,encPass){
  var decrypted  = CryptoJS.AES.decrypt(encrypted, encPass).toString(CryptoJS.enc.Utf8);

  console.log('decrypted',decrypted);

  return decrypted;
}

export function removeUser(userId){
  return Meteor.users.remove({_id:userId})
}

export function makeAdmin(userId){
  return Meteor.users.update({_id:userId},{$set:{'profile.admin':true}})
}
