import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';

import { ICOTokens } from '../api/collections/icotokens';
import Logger from '../utils/logger';

const TOKEN_QUERY = {
  verified: true,
  explorersuccess: { $ne: true },
  verifyUrl: { $exists: true, $ne: '' },
};

export function sendVerifiedICOs() {
  const tokens = ICOTokens.find(TOKEN_QUERY).fetch();

  tokens.reduce(reducer, Promise.resolve([])).then(results => {

  }).catch(err => {
    Logger.log('Error processing verified ICOs', err);
  });
}

function reducer(promiseChain, token) {
  const next = chainResults => {
    return handleRequest(token).then(currentResult => {
      return [ ...chainResults, currentResult ];
    }).catch(err => {
      Logger.log('Error posting verified ICO to explorer', err);
    });
  }

  return promiseChain.then(next);
}

function handleRequest(token) {
  return new Promise((resolve, reject) => {
    Logger.log('sending ping to explorer for ', token._id);

    HTTP.get(token.verifyUrl, (err, res) => {
      if (err) {
        console.log(err);
        return reject(err);
      }

      // FIXME: find the status in a better way
      const status = res.content.split('<dd>')[1].split('</dd>')[0];
      const success = status === 'SUCCESS';

      Logger.log('ping status', status);

      ICOTokens.update({ _id: token._id }, { $set: { explorersuccess: success }});

      resolve();
    });
  });
}
