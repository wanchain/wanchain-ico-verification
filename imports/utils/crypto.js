import CryptoJS from 'crypto-js';

export default Crypto = {
  encrypt,
  decrypt,
};

function encrypt(str, key) {
  return CryptoJS.AES.encrypt(str, key).toString();
}

function decrypt(str, key) {
  return CryptoJS.AES.decrypt(str, key).toString(CryptoJS.enc.Utf8);
}
