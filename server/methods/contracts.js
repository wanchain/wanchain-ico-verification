import CryptoJS from 'crypto-js';

import { Meteor } from 'meteor/meteor';

import { ICOTokens } from '../../imports/startup/lib/collections';
import { instantiateWeb3 } from '../../imports/utils/web3';
import { saveFile } from '../../imports/files/saveFile';
import { createTar } from '../../imports/files/createTar';

Meteor.methods({
  pingExplorer,
  setVerifyUrl,
  verifyContractCode,
});

function buildSource(token) {
  return {
    // Required: Source code language, such as 'Solidity', 'serpent', 'lll',
    // 'assembly', etc.
    language: 'Solidity',

    sources: {
      [token._id]: token.solidity,
    },

    // Optional
    compiler: {
      version: token.compiler || false,
    },

    settings: {
      optimizer: {
        enabled: token.optimized,
        runs: 200
      },

      // Version of the EVM to compile for. Affects type checking and code
      // generation. Can be homestead, tangerineWhistle, spuriousDragon,
      // byzantium or constantinople
      evmVersion: 'byzantium',

      outputSelection: {
        // Enable the metadata and bytecode outputs of every single contract.
        // Enable the source map output of every single contract.
        // Enable the legacy AST output of every single file.
        '*': {
          '*': ['metadata', 'evm.bytecode', 'evm.bytecode.sourceMap', 'legacyAST']
        },
        // Enable the abi and opcodes output of MyContract defined in file def.
        'def': {
          'Counter': ['abi', 'evm.bytecode.opcodes', 'evm.bytecode']
        },
      }
    }
  };
}

function verifyContractCode(address, network) {
  const web3 = instantiateWeb3(network);
  const token = ICOTokens.findOne(address);

  const source = buildSource(token);
  const optimized = token.optimized ? 1 : 0;
  const compiled = solc.compile(source, optimized); // 1 activates the optimiser
  const contractNames = Object.keys(compiled.contracts);

  let matched = false;

  return new Promise((resolve, reject) => {

    if (! contractNames.length) {
      return reject();
    }

    web3.eth.getCode(address.toUpperCase()).then(deployedCode => {

      const blockchainCode = deployedCode.replace('0x', '').split('a165627a7a72305820')[0];

      console.log(blockchainCode);

      console.log(compiled.contracts.length);

      for (let i = 0; i < contractNames.length; i++) {
        if (matched) continue;

        console.log(i);

        const contractName = contractNames[i];
        let compiledCode = compiled.contracts[contractName].bytecode.split('a165627a7a72305820')[0];

        console.log(contractName);
        console.log(compiled.contracts[contractName].bytecode);

        // if (compiledCode.split('f300').length > 1) {
        //   console.log('splitting on f300');
        //   compiledCode = compiledCode.split('f300')[1];
        // }

        // console.log('1', blockchainCode);
        // console.log('2', compiledCode);

        if (compiledCode === blockchainCode) {

          console.log('it matched!');
          matched = true;

          ICOTokens.update({ _id: address }, {
            $set: {
              verifyattempt: true,
              verified: true,
            }
          });

          const saveSol = saveFile(token.solidity, `${address}.sol`);
          const saveAbi = saveFile(token.abi, `${address}.abi`);
          const saveTar = createTar(address);

          Promise.all([ saveSol, saveAbi ]).then(saveTar).catch(err => {
            console.log('Error saving tar', err);
            reject(err);
          }).then(res => {
            resolve();
          });

        } else {

          console.log('no match......')

          ICOTokens.update({ _id: address }, {
            $set: {
              verifyattempt: true,
              verified: false,
            }
          });

          if (i == contractNames.length - 1) {
            resolve();
          }
        }
      }
    }).catch(err => {
      console.log(err);
      reject(err);
    });
  });
};

function setVerifyUrl(address) {
  const {
    password,
    explorerApiUrl,
  } = Meteor.settings.env;

  const encrypted = CryptoJS.AES.encrypt(address, address.toLowerCase() + password);
  const verifyUrl = `${explorerApiUrl}/${address}/${encodeURIComponent(encrypted.toString())}`;

  ICOTokens.update({ _id: address }, {
    $set: { verifyUrl },
  });

  return verifyUrl;
};

function pingExplorer(address) {
  const token = ICOTokens.findOne(address);
  if (token && token.verifyUrl) {
    return HTTP.get(token.verifyUrl);
  }
}
