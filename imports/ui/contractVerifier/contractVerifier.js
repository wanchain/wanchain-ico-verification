import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import Web3 from 'web3';

import { ICOTokens } from '../../startup/lib/collections';

import './contractVerifier.html';

import '../tokenForm/tokenForm';
import '../contractForm/contractForm';

Template.contractVerifier.helpers({
  contract() {
    const addr = Session.get('contractAddress');
    return ICOTokens.findOne(addr);
  },
  creatingTar() {
    return Session.get('creatingTar');
  },
  network() {
    return Session.get('network');
  },
  conf() {
    const network = Session.get('network');
    return ToolConfig.find({ _id: network }).fetch();
  }
});

Template.contractVerifier.events({
  'click .pingMe'(event, template) {
    event.preventDefault();

    const addr = Session.get('contractAddress');
    const network = Session.get('network');

    Meteor.call('pingExplorer', addr, network, function(err, resp) {
      console.log(err, resp);
    })
  },

  'click .editContract'(event, template) {
    event.preventDefault();

    const addr = Session.get('contractAddress');
    ICOTokens.update({ _id: addr }, {
      $set: {
        explorersuccess: false,
        verified: false,
      }
    });

    $('#myTab a[href="#home"]').tab('show');
  }
});

Template.contractVerifier.onCreated(function() {
  const params = Session.get('params') || {};
  const address = params.a;

  if (address) {
    Session.set('contractAddress', address);
  }
});

Template.contractVerifier.onRendered(function() {
  //add your statement here
});

Template.contractVerifier.onDestroyed(function() {
  //add your statement here
});
