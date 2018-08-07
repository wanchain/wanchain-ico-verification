import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';

import './header.html';

Template.header.helpers({
  network() {
    return Session.get('network').replace('net', ' network');
  }
});

Template.header.events({
  //add your events here
});

Template.header.onCreated(function () {
  //add your statement here
});

Template.header.onRendered(function () {
  //add your statement here
});

Template.header.onDestroyed(function () {
  //add your statement here
});
