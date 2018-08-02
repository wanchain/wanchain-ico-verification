import { Template } from 'meteor/templating';

import './config.html';

Template.config.helpers({
  // conf() {
  //   return ToolConfig.find({ _id: Session.get('network') }).fetch();
  // }
});

Template.config.events({
   // 'click .editMe'(event, template) {
   //   event.preventDefault();
   //   var self = this;
   //   var theNewUrl = prompt('Enter New Url (include https:// and do not trail with a backslash)', self.explorerApiUrl);
   //   if (theNewUrl) {
   //     ToolConfig.update({ _id: self._id }, { $set: { explorerApiUrl: theNewUrl }});
   //   }
   // },

   // 'click .editBlock'(event, template) {
   //   event.preventDefault();
   //   var self = this;
   //   var theNewUrl = prompt('Enter New RPC Url (include https:// and do not trail with a backslash)', self.blockchainRPCUrl);
   //   if (theNewUrl) {
   //     ToolConfig.update({ _id: self._id }, { $set:{ blockchainRPCUrl: theNewUrl }});
   //   }
   // },
});

Template.config.onCreated(function () {

});

Template.config.onRendered(function () {
  //add your statement here
});

Template.config.onDestroyed(function () {
  //add your statement here
});
