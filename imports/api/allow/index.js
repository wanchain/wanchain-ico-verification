import { ICOTokens } from '../collections/icotokens';
import { ToolConfig } from '../collections/toolconfig';

ICOTokens.allow({
  insert(userId, doc) {
    return userId;
    // The user must be logged in and the document must be owned by the user.
    // return userId && doc.owner === userId;
  },

  update(userId, doc, fields, modifier) {
    return userId;
    // Can only change your own documents.
    // return doc.owner === userId;
  },

  remove(userId, doc) {
    return userId;
    // Can only remove your own documents.
    // return doc.owner === userId;
  },

  // fetch: ['owner']
});

ToolConfig.allow({
  insert(userId, doc) {
    return true;
  },

  update(userId, doc, fields, modifier) {
    return true;
  },

  remove(userId, doc) {
    return true;
  },
});
