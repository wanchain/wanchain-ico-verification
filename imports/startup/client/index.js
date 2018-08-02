import { Meteor } from 'meteor/meteor';
import { Deps } from 'meteor/tracker';
import { Session } from 'meteor/session';
import { ReactiveVar } from 'meteor/reactive-var';

import './layouts';
import './routes';

Web3 = require('web3');

web3 = new Web3(new Web3.providers.HttpProvider(Meteor.settings.public.rpc.testnet));

Session.set('network', 'testnet');

web3.eth.getCoinbase(function(err, res) {
  console.log('coinbase', res)
  Session.set('coinbase', { address: res })
});

Meteor.startup(function() {
  console.log('starting up client...', new Date().getTime())

  Meteor.call('getPath', function(err, res) {
    Session.set('path', res);
  })
});

Deps.autorun(function() {
  return Meteor.subscribe('tokens', Session.get('contractAddress'));
});
