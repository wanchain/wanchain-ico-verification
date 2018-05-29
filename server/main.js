import {Meteor} from 'meteor/meteor';

solc = require('solc');
writeJsonFile = require('write-json-file');
artifactor = require("truffle-artifactor");
fs = require('fs');
Fiber = require('fibers');


sleep = function (ms) {
    var fiber = Fiber.current;
    setTimeout(function () {
        fiber.run();
    }, ms);
    Fiber.yield();
}


Meteor.startup(function () {
    //process.env.DISABLE_WEBSOCKETS = 1;
    console.log('starting up server...', new Date().getTime())
    SyncedCron.start();
});
