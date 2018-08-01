import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { ICOTokens } from '../../startup/lib/collections';

import './tokenForm.html';

import check from './check';
import submit from './submit';
import changeIcon from './changeIcon';

Template.tokenForm.helpers({
  contractAddress() {
    const addr = Session.get('contractAddress');
    if (addr) {
      return ICOTokens.findOne({ _id: addr });
    }
  },

  addy() {
    return Session.get('contractAddress');
  },

  loading() {
    return Session.get('loading');
  },

  path() {
    return Session.get('path');
  },

  testnet() {
    return Session.get('network') === 'testnet';
  },

  net() {
    return Session.get('network');
  },

  hasVal(key) {
    if (key && ICOTokens.find().count()) {
      const token = ICOTokens.findOne({ _id: Session.get('contractAddress') });
      if (token && token[key] && token.verified) {
        return 'readonly';
      }
    }
  }
});

Template.tokenForm.events({
  'change .icon-input': changeIcon,
  'click .check': check,
  'submit .tokenForm': submit,

  'click .reset'(event, template) {
    event.preventDefault();
    Session.set('contractAddress', false);
    Session.set('loading', false);
  }
});

Template.tokenForm.onCreated(function() {
  Session.set('loading', false);
});

Template.tokenForm.onRendered(function() {

});

Template.tokenForm.onDestroyed(function() {
  //add your statement here
});
