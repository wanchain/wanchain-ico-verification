import { Meteor } from 'meteor/meteor';
import { instantiateWeb3 } from '../utils';

Meteor.methods({

  getCode(contractAddress) {
    if (typeof contractAddress !== 'string') {
      throw new Meteor.Error('address must be a string');
    }

    const addr = contractAddress.toUpperCase();
    const web3 = instantiateWeb3('testnet');

    return web3.eth.getCode(addr);
  },

});
