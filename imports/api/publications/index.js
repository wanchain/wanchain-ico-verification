import { Meteor } from 'meteor/meteor';
import { ICOTokens } from '../collections/icotokens';
import { ToolConfig } from '../collections/toolconfig';
import { isAdmin } from '../../utils/users';

Meteor.publish('tokens', function(address) {
  if (! this.userId || ! address) {
    return [];
  }

  return ICOTokens.find({ _id: address });
});

Meteor.publish('toolconf', function() {
  return ToolConfig.find();
});

Meteor.publish('users', function() {
  const user = Meteor.users.findOne(this.userId);

  // ensure user is admin
  if (! isAdmin(user)) {
    return [];
  }

  return Meteor.users.find({ 'profile.icoUser': true });
});
