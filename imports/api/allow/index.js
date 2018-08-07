import { ICOTokens } from '../collections/icotokens';
import { ToolConfig } from '../collections/toolconfig';

ICOTokens.allow({
  insert(userId, doc) {
    return !! userId;
  },

  update(userId, doc, fields, modifier) {
    return !! userId;
  },

  remove(userId, doc) {
    return !! userId;
  },
});

ToolConfig.allow({
  insert(userId, doc) {
    return false;
  },

  update(userId, doc, fields, modifier) {
    return false;
  },

  remove(userId, doc) {
    return false;
  },
});
