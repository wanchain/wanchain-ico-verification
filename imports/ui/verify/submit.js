import { Template } from 'meteor/templating';

import Hex from '../../utils/hex';
import WanTools from '../../utils/wantools';
import swal from '../utils/swal';

export function submit(event, template) {
  event.preventDefault();

  const address = $(event.target).find('[name="address"]').val();
  const action = $(event.target).find('button').attr('action');

  const hash = Hex.stripHexPrefix(address);

  if (! address) {
    alert('You must enter an address!');
    return false;
  }
  else if (hash.length !== 40) {
    swal({
      title: 'Invalid Address Length',
      text: 'The address you entered is not valid.',
      button: 'Try Again',
    });

    return false;
  }

  const instance = Template.instance();
  const wanAddress = WanTools.addressChecksum(address);

  if (action === 'convert') {
    instance.state.set('verifyAttempt', false);
    instance.state.set('verified', false);
    instance.state.set('wanchainAddress', wanAddress);
  }
  else if (action === 'verify') {
    instance.state.set('verifyAttempt', true);

    if (instance.state.get('wanchainAddress') == wanAddress) {
      instance.state.set('verified', true);
    }
    else {
      instance.state.set('verified', false);
      instance.state.set('wanchainAddress', false);
    }
  }
}
