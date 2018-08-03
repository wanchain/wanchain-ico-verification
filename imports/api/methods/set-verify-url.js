import { Meteor } from 'meteor/meteor';
import { Match } from 'meteor/check';

import { ICOTokens } from '../collections/icotokens';
import { encrypt } from '../../utils/crypto';

export function setVerifyUrl(address) {
  if (! address || ! Match.test(address, String)) {
    console.log('Error in setVerifyUrl: address bad format', address);
    return false;
  }

  const {
    password,
    explorerApiUrl,
  } = Meteor.settings.env;

  const encrypted = encrypt(address, address.toLowerCase() + password);
  const verifyUrl = `${explorerApiUrl}/${address}/${encodeURIComponent(encrypted)}`;

  ICOTokens.update({ _id: address }, {
    $set: { verifyUrl },
  });

  return verifyUrl;
};
