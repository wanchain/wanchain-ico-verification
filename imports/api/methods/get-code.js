import { Meteor } from 'meteor/meteor';
import { instantiateWeb3 } from '../../utils/web3';

export function getCode(address, network) {
  if (typeof address !== 'string') {
    throw new Meteor.Error('address must be a string');
  }

  const addr = address.toUpperCase();
  const web3 = instantiateWeb3(network);

  return web3.eth.getCode(addr);
};
