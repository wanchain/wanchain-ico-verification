import { Template } from 'meteor/templating';
import { changeAddress } from './changeAddress';
import { submit } from './submit';

import './verify.html';

Template.verify.helpers({
  verifyAttempt() {
    return Session.get('verifyAttempt');
  },
  verified() {
    return Session.get('verified');
  },
  wanchainAddress() {
    return Session.get('wanchainAddress');
  },
});

Template.verify.events({
  'keyup .verifyForm #addressInput': changeAddress,
  'submit .verifyForm': submit,

  'click .backup'(event, template) {
    event.preventDefault();

    Session.set('wanchainAddress', false);
    Session.set('verified', false);
    Session.set('verifyAttempt', false);
  },
});

Template.verify.onCreated(function() {

});

Template.verify.onRendered(function() {

});

Template.verify.onDestroyed(function() {
  //add your statement here
});
