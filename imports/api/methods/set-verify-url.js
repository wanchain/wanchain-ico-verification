import { Meteor } from 'meteor/meteor';
import { Match } from 'meteor/check';

import { ICOTokens } from '../collections/icotokens';
import Crypto from '../../utils/crypto';
import Logger from '../../utils/logger';

export function setVerifyUrl(address) {
  if (! address || ! Match.test(address, String)) {
    Logger.log('Error in setVerifyUrl: address bad format', address);
    return false;
  }

  const {
    password,
    explorerApiUrl,
  } = Meteor.settings.env;

  const token = ICOTokens.findOne(address, { network: 1 });
  const url = token.network === '1' ? explorerApiUrl.mainnet : explorerApiUrl.testnet;

  const encrypted = Crypto.encrypt(address, address.toLowerCase() + password);
  const verifyUrl = `${url}/verification/${address}/${encodeURIComponent(encrypted)}`;

  ICOTokens.update({ _id: address }, {
    $set: { verifyUrl },
  });

  return verifyUrl;
};
