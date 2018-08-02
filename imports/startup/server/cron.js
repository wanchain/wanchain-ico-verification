import { Meteor } from 'meteor/meteor';
import { SyncedCron } from 'meteor/percolate:synced-cron';

import { sendVerifiedICOs } from '../../crontasks/send-verified-icos';

Meteor.startup(function () {
  // process.env.DISABLE_WEBSOCKETS = 1;
  console.log('starting up server...', new Date().getTime())
  SyncedCron.start();
});

SyncedCron.add({
  name: 'Send Verified ICOS',
  schedule: function(parser) {
    // parser is a later.parse object
    return parser.text('every 30 seconds');
  },
  job: sendVerifiedICOs,
});
