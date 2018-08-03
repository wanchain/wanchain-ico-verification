import { Match } from 'meteor/check';

export function isIcoUser(user) {
  if (! Match.test(user, Object)) {
    return false;
  }

  const {
    profile = {},
  } = user;

  return !! profile.icoUser;
}

export function isAdmin(user) {
  if (! Match.test(user, Object)) {
    return false;
  }

  const {
    profile = {},
  } = user;

  return !! profile.admin;
}
