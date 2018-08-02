import Web3 from 'web3';
import { stripHexPrefix } from './hex';

export function wanAddressChecksum(address) {
  const web3 = new Web3();

  const lower = stripHexPrefix(address).toLowerCase();
  const hash = web3.utils.sha3(address).toString('hex');
  // Fix web3 0.14.0 and 0.20.0 incompatibility
  const lowerHash = stripHexPrefix(hash);

  let checksum = '0x';

  for (let i = 0; i < lower.length; i++) {
    if (parseInt(lowerHash[i], 16) < 8) {
      checksum += lower[i].toUpperCase();
    } else {
      checksum += lower[i];
    }
  }

  return checksum;
}
