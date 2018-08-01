import { Meteor } from 'meteor/meteor';
import { ICOTokens, ToolConfig } from '../imports/startup/lib/collections.js';

Meteor.publish('tokens', function(contractAddress) {
  if (contractAddress) {
    return ICOTokens.find({ _id: contractAddress });
  }
  return [];
});

Meteor.publish('toolconf', function() {
  return ToolConfig.find();
});

Meteor.publish('users', function() {
  return Meteor.users.find({ 'profile.icoUser': true });
});
