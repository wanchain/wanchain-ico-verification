import { Session } from 'meteor/session';
import WanTools from '../../utils/wantools';

export function changeAddress(event, template) {
  Session.set('wanchainAddress', false);
  Session.set('verified', false);
  Session.set('verifyAttempt', false);

  const address = $(event.target).val();
  const lower = address.toLowerCase();
  const upper = address.toUpperCase();

  if (address === lower) {
    console.log('is lower');
  }
  else if (address === upper) {
    console.log('is upper');
  } else {
    const action = 'verify';
    const wanchainAddress = WanTools.addressChecksum(address);

    Session.set('verifyAttempt', true);

    if (action === "verify") {
      Session.set('verifyAttempt', true);
      if (address == wanchainAddress) {
        Session.set('verified', true);
        Session.set('wanchainAddress', wanchainAddress);
      } else {
        Session.set('verified', false);
        Session.set('wanchainAddress', false);
      }
    } else {
      Session.set('verifyAttempt', false);
      Session.set('verified', false);
      Session.set('wanchainAddress', wanchainAddress);
    }
  }
}
