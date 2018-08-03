import CryptoJS from 'crypto-js';

export function encrypt(str, key) {
  return CryptoJS.AES.encrypt(str, key).toString();
}

export function decrypt(str, key) {
  return CryptoJS.AES.decrypt(str, key).toString(CryptoJS.enc.Utf8);
}
