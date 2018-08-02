import { pingExplorer } from './ping-explorer';
import { setVerifyUrl } from './set-verify-url';
import { validateContract } from './validate-contract';
import { verifyContractCode } from './verify-contract-code';

import { saveBlob, saveFile, saveJson } from '../../files/saveFile';
import { createTar } from '../../files/createTar';

import { addUser, removeUser, makeAdmin } from './user';

Meteor.methods({
  // contracts
  pingExplorer,
  setVerifyUrl,
  validateContract,
  verifyContractCode,

  // files
  saveBlob,
  saveFile,
  saveJson,
  createTar,

  // users
  addUser,
  removeUser,
  makeAdmin,
});
