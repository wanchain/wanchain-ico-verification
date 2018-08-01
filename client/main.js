import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import '../imports/startup/lib';
import '../imports/startup/client';

import './main.html';

Web3 = require('web3');

web3 = new Web3(new Web3.providers.HttpProvider(Meteor.settings.public.rpc.testnet));


Session.set('network', 'testnet');


web3.eth.getCoinbase(function(err, resp) {
  // console.log('coinbase',resp)
  Session.set('coinbase', { address: resp })
});



Meteor.startup(function() {

  console.log('starting up client...', new Date().getTime())
  Meteor.call('getPath', function(err,resp) {
    //console.log(resp);
    Session.set('path', resp);
  })
  // Meteor.subscribe('toolconf');

});


Deps.autorun(function() {
  return Meteor.subscribe('tokens', Session.get('contractAddress'));
});
