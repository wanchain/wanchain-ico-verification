import { Meteor } from 'meteor/meteor';

import { ICOTokens } from '../../imports/startup/lib/collections';
import { instantiateWeb3 } from '../../imports/utils/web3';
import { saveFile } from '../../imports/files/saveFile';
import StandardAbi from '../../imports/standard-abi';

Meteor.methods({
  getCode,
  validateContract,
});

function getCode(address, network) {
  if (typeof address !== 'string') {
    throw new Meteor.Error('address must be a string');
  }

  const addr = address.toUpperCase();
  const web3 = instantiateWeb3(network);

  return web3.eth.getCode(addr);
};

function validateContract(address, network) {
  if (typeof address !== 'string') {
    throw new Meteor.Error('address must be a string');
  }

  const web3 = instantiateWeb3(network);

  return new Promise(function(resolve, reject) {
    web3.eth.getCode(address.toUpperCase()).catch(err => {
      console.log('Error getting code from address:', address, network, err);
      reject(new Meteor.Error(404, 'notfound'));
    }).then(code => {

      if (! code || code.length < 4) {
        console.log('Empty code from address:', address, network);
        reject(new Meteor.Error(404, 'notfound'));
        return;
      }

      const token = ICOTokens.findOne({ _id: address });

      if (! token) {
        const user = Meteor.user();
        const newToken = {
          _id: address,
          lastEdited: new Date(),
          user: {
            _id: user._id,
            username: user.username,
          },
        };

        ICOTokens.insert(newToken);
      }

      const tokenContract = new web3.eth.Contract(StandardAbi, address.toUpperCase());

      if (! tokenContract) {
        console.log('Could not get contract for address:', address, network);
        reject(new Meteor.Error(412, 'invalid'));
      }

      const promises = [
        tokenContract.methods.name().call(),
        tokenContract.methods.symbol().call(),
        tokenContract.methods.totalSupply().call(),
        tokenContract.methods.decimals().call(),
      ];

      Promise.all(promises).then(res => {
        [ name, symbol, totalSupply, decimals ] = res;

        ICOTokens.update({ _id: address }, {
          $set: {
            name,
            symbol,
            totalSupply,
            decimals,
          }
        });

        saveFile(code, `${address}.byte`);
        resolve();
      }).catch(err => {
        ICOTokens.remove({ _id: address });

        console.log('Error getting contract details from address:', address, network, err);
        reject(new Meteor.Error(412, 'invalid'));
      });
    });
  });
}
