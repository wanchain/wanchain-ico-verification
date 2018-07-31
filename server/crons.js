import { ICOTokens } from '../imports/startup/lib/collections';

SyncedCron.add({
    name: 'Send Verified ICOS',
    schedule: function (parser) {
        // parser is a later.parse object
        return parser.text('every 30 seconds');

    },
    job: function () {
        _.each(ICOTokens.find({verified: true, explorersuccess: {$ne: true}}).fetch(), function (e) {

            Fiber(function () {
                console.log('sending ping to explorer for ', e._id);
                sleep(3000);
                Meteor.call('pingExplorer', e._id, function (err, resp) {
                    var thestatus = resp.content.split('<dd>')[1].split('</dd>')[0];

                    console.log('the status', thestatus)
                    Fiber(function () {
                        //TickerStats.remove({'_id':'LTC'});

                        //sleep(2000);
                        //TickerStats.insert({'_id':'LTC'})
                        //ICOTokens.update({'_id': contractAddress}, {$set: {verifyattempt: true, verified: true}})
                        sleep(3000);
                        if (thestatus === 'SUCCESS') {
                            console.log('good request')
                            ICOTokens.update({'_id': e._id}, {$set: {explorersuccess: true}})
                        } else {
                            console.log('bad request')
                            ICOTokens.update({'_id': e._id}, {$set: {explorersuccess: false}})
                        }

                    }).run()


                })
            }).run()
        })
    }
});
