import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { decrypt } from '../../utils/crypto'

import './createICOUser.html';

Template.createICOUser.helpers({
  users() {
    const query = { 'profile.icoUser': true };
    const opts = { sort: { 'profile.createdOn': -1 }};

    return Meteor.users.find(query, opts);
  }
});

Template.createICOUser.events({
  'submit .createUser'(event, template) {
    event.preventDefault();

    const formFields = $(event.target).serializeArray();

    const user = {
      profile: {
        icoUser: true,
        createdOn: new Date(),
      }
    };

    formFields.forEach(function(field) {
      user[field.name] = field.value;
    });

    Meteor.call('createAccount', user, function(err, res) {
      console.log(res);
    })
  },

  'click .decrypt'(event, template) {
    event.preventDefault();

    // TODO: this should not be a prompt since the password is not masked;
    // instead it should be a popup form with an input with type "password"
    const key = prompt('Enter encryption password');
    const decrypted = decrypt(this.profile.password, key);

    if (decrypted) {
      alert('password: ' + decrypted);
    }
    else {
      alert('invalid decryption password');
    }
  }
});

Template.createICOUser.onCreated(function() {
  Meteor.subscribe('users');
});

Template.createICOUser.onRendered(function() {
  //add your statement here
});

Template.createICOUser.onDestroyed(function() {
  //add your statement here
});