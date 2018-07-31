import { Meteor } from 'meteor/meteor';

import Web3 from 'web3';

const instantiateWeb3 = function(network) {
  if (network !== 'mainnet' && network !== 'testnet') {
    network = 'testnet';
  }

  const provider = Meteor.settings.public.rpc[network];
  return new Web3(new Web3.providers.HttpProvider(provider));
};

export {
  instantiateWeb3,
};
