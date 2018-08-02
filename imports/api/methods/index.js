import { pingExplorer, setVerifyUrl, verifyContractCode } from './contracts';
import { getFile, getPath, getToken, removeToken } from './getFile';
import { createAccount, removeUser, makeAdmin } from './user';
import { getCode, validateContract } from './web3';
import { parseContract } from './parse-smart-contract';
import { saveBlob, saveFile, saveJson } from '../../files/saveFile';
import { createTar } from '../../files/createTar';

Meteor.methods({
  getFile,
  getPath,
  getToken,
  removeToken,

  pingExplorer,
  setVerifyUrl,
  verifyContractCode,

  getCode,
  validateContract,

  parseContract,

  saveBlob,
  saveFile,
  saveJson,
  createTar,

  createAccount,
  removeUser,
  makeAdmin,
});
