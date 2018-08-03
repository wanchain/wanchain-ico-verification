import { Meteor } from 'meteor/meteor';
import { Match } from 'meteor/check';
import { Accounts } from 'meteor/accounts-base';
import { Random } from 'meteor/random'
import randomWord from 'random-word';

import Crypto from '../../utils/crypto';

const SYMBOLS = [ '/', '+', '-', '_' ];

function newPassword() {
  const sym = Random.choice(SYMBOLS);
  return `${randomWord()}${sym}${randomWord()}`;
}

export function addUser(userData) {
  if (! Match.test(userData, Object)) {
    throw new Meteor.Error(413, 'User account must be an object');
  }

  const key = Meteor.settings.env.password;

  userData.password = newPassword();
  userData.profile.password = Crypto.encrypt(userData.password, key);

  // returns user id
  return Accounts.createUser(userData);
}

export function removeUser(userId) {
  return Meteor.users.remove({ _id: userId });
}

export function makeAdmin(userId) {
  return Meteor.users.update({ _id: userId }, {
    $set: { 'profile.admin': true }
  });
}

export function revokeAdmin(userId) {
  return Meteor.users.update({ _id: userId }, {
    $set: { 'profile.admin': false }
  });
}
