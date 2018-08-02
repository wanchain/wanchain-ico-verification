import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';

import './networkSwitch.html';

Template.networkSwitch.helpers({
  network() {
    return Session.get('network') === 'testnet';
  }
});

Template.networkSwitch.events({
  'change .network'(event, template) {
    event.preventDefault();

    const network = $(event.target).val();
    Session.set('network', network);

    console.log(`network changed to ${network}`);
  }
});

Template.networkSwitch.onCreated(function () {
  //add your statement here
});

Template.networkSwitch.onRendered(function () {
  //add your statement here
});

Template.networkSwitch.onDestroyed(function () {
  //add your statement here
});
