import { HTTP } from 'meteor/http';
import { ICOTokens } from '../collections/icotokens';

export function sendTokenToExplorer(address) {
  const token = ICOTokens.findOne(address);
  if (token && token.verifyUrl) {
    return HTTP.get(token.verifyUrl);
  }
}
