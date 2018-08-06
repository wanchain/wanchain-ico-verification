import { Meteor } from 'meteor/meteor';
import { Deps } from 'meteor/tracker';
import { Session } from 'meteor/session';

import './layouts';
import './routes';

Session.set('network', 'mainnet');

Meteor.startup(function() {
  console.log('starting up client...', new Date().getTime())
});

Deps.autorun(function() {
  const address = Session.get('contractAddress');
  if (address) {
    Meteor.subscribe('tokens', address);
  }
});
