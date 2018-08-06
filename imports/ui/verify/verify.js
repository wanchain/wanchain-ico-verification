import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { changeAddress } from './changeAddress';
import { submit } from './submit';

import './verify.html';

Template.verify.helpers({
  verifyAttempt() {
    return Template.instance().state.get('verifyAttempt');
  },
  verified() {
    return Template.instance().state.get('verified');
  },
  wanchainAddress() {
    return Template.instance().state.get('wanchainAddress');
  },
});

Template.verify.events({
  'keyup .verifyForm #addressInput': changeAddress,
  'submit .verifyForm': submit,

  'click .backup'(event, template) {
    event.preventDefault();

    const instance = Template.instance();

    instance.state.set('wanchainAddress', false);
    instance.state.set('verified', false);
    instance.state.set('verifyAttempt', false);
  },
});

Template.verify.onCreated(function() {

  this.state = new ReactiveDict();

  this.state.setDefault({
    wanchainAddress: false,
    verifyAttempt: false,
    verified: false,
  });
});

Template.verify.onRendered(function() {

});

Template.verify.onDestroyed(function() {
  //add your statement here
});
