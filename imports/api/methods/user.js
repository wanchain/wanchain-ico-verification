import { Meteor } from 'meteor/meteor';
import { Match } from 'meteor/check';
import { Accounts } from 'meteor/accounts-base';
import { RandomWord } from 'meteor/augustnagro:random-word';

import { encrypt } from '../../utils/crypto';

// TODO: these methods should be restricted to only admin users

export function addUser(userData) {
  if (! Match.test(userData, Object)) {
    throw new Meteor.Error(413, 'User account must be an object');
  }

  const key = Meteor.settings.env.password;

  userData.password = RandomWord.get() + RandomWord.get();
  userData.profile.password = encrypt(userData.password, key);

  userData._id = Accounts.createUser(userData);

  return userData;
}

export function removeUser(userId) {
  return Meteor.users.remove({ _id: userId });
}

export function makeAdmin(userId) {
  return Meteor.users.update({ _id: userId }, { $set: { 'profile.admin': true }});
}
