import { ICOTokens } from '../../imports/startup/lib/collections';
import { getFilesPath } from '../../imports/utils/filesPath.js';

Meteor.methods({
  getFile(contractId) {
    return Assets.absoluteFilePath('.uploads/'+contractId+'.png');
  },

  getPath() {
    return getFilesPath();
  },

  getToken(tokenId) {
    return ICOTokens.find({ _id: tokenId }).count();
  },

  removeToken(tokenId) {
    return ICOTokens.remove({ _id: tokenId });
  },
})
