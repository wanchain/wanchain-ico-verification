import { Meteor } from 'meteor/meteor';
import { Deps } from 'meteor/tracker';
import { Session } from 'meteor/session';

import './layouts';
import './routes';

Session.set('network', 'testnet');

Meteor.startup(function() {
  console.log('starting up client...', new Date().getTime())

  Meteor.call('getPath', function(err, res) {
    Session.set('path', res);
  })
});

Deps.autorun(function() {
  const address = Session.get('contractAddress');
  if (address) {
    Meteor.subscribe('tokens', address);
  }
});
