import Web3 from 'web3';

import { Session } from 'meteor/session';

import { ICOTokens } from '../../api/collections/icotokens';
import StandardAbi from '../../standard-abi';
import getSwal from '../swal';

export default function(event, template) {
  Session.set('loading', false);

  const address = $('.address').val().split('.')[0];

  if (! address) {
    alert('You must enter a valid contract address!')
    return;
  }

  Session.set('contractAddress', address);
  Session.set('loading', {
    message: '<i class="fa fa-spin fa-spinner"></i> getting contract code from blockchain... ',
  });

  const web3 = new Web3();
  const isValid = web3.utils.isAddress(address.toUpperCase());

  if (! isValid) {
    Session.set('loading', {
      class: 'danger',
      message: '<i class="fa  fa-warning"></i> the address you entered is not a valid address',
    });

    swal(getSwal(
      'Invalid Address',
      'The address you entered is not a valid address',
    ));

    return;
  }

  Meteor.call('validateContract', address, Session.get('network'), function(err, res) {

    if (err) {
      Session.set('contractAddress', false);

      if (err.reason === 'invalid') {
        Session.set('loading', {
          class: 'danger',
          message: '<i class="fa fa-warning"></i> the address you entered is not a valid token contract',
        });

        swal(getSwal(
          'Invalid Contract',
          'The address you entered is not a valid token contract',
        ));
      }
      else {
        Session.set('loading', {
          class: 'danger',
          message: '<i class="fa fa-warning"></i> contract not found',
        });

        swal(getSwal(
          'Contract Not Found',
          'The contract was not found',
        ));
      }

      return;
    }

    Session.set('loading', {
      class: 'success',
      message: `<i class="fa fa-check"></i> found contract ${address}`,
    });
  });
};
