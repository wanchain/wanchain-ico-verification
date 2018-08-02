import { Meteor } from 'meteor/meteor';

import { ICOTokens } from '../collections/icotokens';
import { encrypt } from '../../utils/crypto';

export function setVerifyUrl(address) {
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
