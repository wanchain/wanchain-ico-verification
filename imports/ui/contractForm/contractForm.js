import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';

import { ICOTokens } from '../../api/collections/icotokens';
import swal from '../utils/swal';

import './contractForm.html';

Template.contractForm.helpers({
  contract() {
    return ICOTokens.findOne(Session.get('contractAddress'));
  },

  hasVal(key) {
    if (key && ICOTokens.find().count()) {
      const token = ICOTokens.findOne({ _id: Session.get('contractAddress') });
      if (token && token[key] && token.verified) {
        return 'disabled';
      }
    }
  }
});

Template.contractForm.events({
  'change .optimized'(event, template) {
    const address = Session.get('contractAddress');
    const optimized = !! $(event.target).val();

    ICOTokens.update({ _id: address }, {
      $set: { optimized, optimizedSet: true }
    });
  },

  'change .compiler'(event, template) {
    const address = Session.get('contractAddress');
    const compiler = $(event.target).val() || false;

    ICOTokens.update({ _id: address }, { $set: { compiler }});
  },

  'change .upload'(ev) {
    const file = document.getElementById('solidityCode').files[0];

    if (! file) {
      return;
    }

    const address = Session.get('contractAddress');
    const fileName = `${address}.sol`;
    const reader = new FileReader();

    reader.readAsText(file);

    reader.onload = function(e) {
      // browser completed reading file - display it
      const solidity = e.target.result;

      ICOTokens.update({ _id: address }, { $set: { solidity }});

      Meteor.call('saveFile', solidity, fileName);

      swal({
        title: 'Solidity Code Saved',
        text: 'Now add your ABI Constructor Arguments',
        icon: 'success',
      }).then(() => {
        window.scroll({
          top: 950,
          left: 0,
          behavior: 'smooth'
        });
      });
    };
  },

  'submit .contractForm'(event, template) {
    event.preventDefault();

    const address = Session.get('contractAddress');
    const network = Session.get('network');

    const abi = $('.abi').val();
    const solidity = $('.contractCode').val();
    const optimized = !! $('.optimized').val() ;

    const updateToken = ICOTokens.update({ _id: address }, {
      $set: { abi, solidity, optimized }
    });

    $('#myTab a[href="#settings"]').tab('show');

    Session.set('creatingTar', true);

    Meteor.call('verifyContractCode', address, network, function(err, res) {
      Session.set('creatingTar', false);

      if (err) {
        console.log(err);
        return;
      }

      Meteor.call('setVerifyUrl', address, network, function(err, verifyUrl) {
        if (err) {
          console.log(err);
          return;
        }

        Session.set('verifyUrl', verifyUrl);
      });
    });
  }
});

Template.contractForm.onCreated(function() {

});

Template.contractForm.onRendered(function() {

});

Template.contractForm.onDestroyed(function() {
  //add your statement here
});
