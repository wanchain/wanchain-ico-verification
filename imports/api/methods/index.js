import { sendTokenToExplorer } from './send-token-to-explorer';
import { setVerifyUrl } from './set-verify-url';
import { validateContract } from './validate-contract';
import { verifyContractCode } from './verify-contract-code';

import { saveFile, saveFileWithEncoding, saveJson } from '../../files/saveFile';
import { createTar } from '../../files/createTar';

import { addUser, removeUser, makeAdmin } from './user';

Meteor.methods({
  // contracts
  sendTokenToExplorer,
  setVerifyUrl,
  validateContract,
  verifyContractCode,

  // files
  saveFile,
  saveFileWithEncoding,
  saveJson,
  createTar,

  // users
  addUser,
  removeUser,
  makeAdmin,
});
