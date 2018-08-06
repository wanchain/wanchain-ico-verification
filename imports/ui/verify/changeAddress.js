import { Template } from 'meteor/templating';
import WanTools from '../../utils/wantools';

export function changeAddress(event, template) {
  const address = $(event.target).val();
  const instance = Template.instance();
  const wanchainAddress = WanTools.addressChecksum(address);

  instance.state.set('verifyAttempt', false);
  instance.state.set('verified', false);

  if (address.toLowerCase() == wanchainAddress.toLowerCase()) {
    instance.state.set('wanchainAddress', wanchainAddress);
  } else {
    instance.state.set('verifyAttempt', true);
    instance.state.set('wanchainAddress', false);
  }
}
