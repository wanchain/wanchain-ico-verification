import solc from 'solc';

import { ICOTokens } from '../collections/icotokens';
import { instantiateWeb3 } from '../../utils/web3';
import { saveFile } from '../../files/saveFile';
import { createTar } from '../../files/createTar';

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

export function verifyContractCode(address, network) {
  const web3 = instantiateWeb3(network);
  const token = ICOTokens.findOne(address);

  const source = buildSource(token);
  const optimized = token.optimized ? 1 : 0;
  const compiled = solc.compile(source, optimized); // 1 activates the optimiser

  let matched = false;

  return new Promise((resolve, reject) => {

    // check for compile errors
    if (! compiled.contracts) {
      console.log('compile error', compiled);
      return reject();
    }

    const contractNames = Object.keys(compiled.contracts);

    // reject if no contracts were generated
    if (! contractNames.length) {
      console.log('no contracts compiled');
      return reject();
    }

    web3.eth.getCode(address.toUpperCase()).then(deployedCode => {

      const blockchainCode = deployedCode.replace('0x', '').split('a165627a7a72305820')[0];

      for (let i = 0; i < contractNames.length; i++) {
        if (matched) continue;

        const contractName = contractNames[i];
        let compiledCode = compiled.contracts[contractName].runtimeBytecode.split('a165627a7a72305820')[0];

        // if (compiledCode.split('f300').length > 1) {
        //   console.log('splitting on f300');
        //   compiledCode = compiledCode.split('f300')[1];
        // }

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

          Promise.all([ saveSol, saveAbi ]).catch(err => {
            console.log('Error saving sol/abi', err);
            reject(err);
          }).then(() => createTar(address)).catch(err => {
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
