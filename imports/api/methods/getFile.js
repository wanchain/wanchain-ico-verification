import { ICOTokens } from '../collections/icotokens';
import { getFilesPath } from '../../utils/filesPath.js';

export function getFile(contractId) {
  return Assets.absoluteFilePath('.uploads/'+contractId+'.png');
}

export function getPath() {
  return getFilesPath();
}

export function getToken(tokenId) {
  return ICOTokens.find({ _id: tokenId }).count();
}

export function removeToken(tokenId) {
  return ICOTokens.remove({ _id: tokenId });
}
