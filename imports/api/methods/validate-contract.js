import { Meteor } from 'meteor/meteor';

import { ICOTokens } from '../collections/icotokens';
import { instantiateWeb3 } from '../../utils/web3';
import { saveFile } from '../../files/saveFile';
import StandardAbi from '../../standard-abi';
import Logger from '../../utils/logger';

export function validateContract(address, network) {
  if (typeof address !== 'string') {
    throw new Meteor.Error('address must be a string');
  }

  const web3 = instantiateWeb3(network);

  // enforce that records are saved with lowercase address
  address = address.toLowerCase();

  return new Promise(function(resolve, reject) {
    web3.eth.getCode(address.toUpperCase()).catch(err => {
      Logger.log('Error getting code from address:', address, network, err);
      reject(new Meteor.Error(404, 'notfound'));
    }).then(code => {

      if (! code || code.length < 4) {
        Logger.log('Empty code from address:', address, network);
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
        Logger.log('Could not get contract for address:', address, network);
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

        Logger.log('Error getting contract details from address:', address, network, err);
        reject(new Meteor.Error(412, 'invalid'));
      });
    });
  });
}
