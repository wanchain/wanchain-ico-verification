import { sendTokenToExplorer } from './send-token-to-explorer';
import { setVerifyUrl } from './set-verify-url';
import { validateContract } from './validate-contract';
import { verifyContractCode } from './verify-contract-code';

import { saveFile, saveFileWithEncoding, saveJson } from '../../files/saveFile';
import { createTar } from '../../files/createTar';

import { addUser, removeUser, makeAdmin } from './user';
import { isAdmin, isIcoUser } from '../../utils/users';

Meteor.methods({
  // contracts
  sendTokenToExplorer: requireLoggedIn(sendTokenToExplorer),
  setVerifyUrl: requireLoggedIn(setVerifyUrl),
  validateContract: requireLoggedIn(validateContract),
  verifyContractCode: requireLoggedIn(verifyContractCode),

  // files
  saveFile: requireLoggedIn(saveFile),
  saveFileWithEncoding: requireLoggedIn(saveFileWithEncoding),
  saveJson: requireLoggedIn(saveJson),
  createTar: requireLoggedIn(createTar),

  // users
  addUser: requireAdmin(addUser),
  removeUser: requireAdmin(removeUser),
  makeAdmin: requireAdmin(makeAdmin),
});

function requireLoggedIn(func) {
  return function() {
    const userId = Meteor.userId();

    if (! userId) {
      throw new Meteor.Error(401, 'Unauthorized');
    }

    return func.apply(this, arguments);
  }
}

function requireAdmin(func) {
  return function() {
    const user = Meteor.user();

    if (! isAdmin(user)) {
      throw new Meteor.Error(401, 'Unauthorized');
    }

    return func.apply(this, arguments);
  }
}
