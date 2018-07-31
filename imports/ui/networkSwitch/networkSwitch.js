import { Template } from 'meteor/templating';

import './networkSwitch.html';

Template.networkSwitch.helpers({
    'network':function(){
        return Session.get('network') === "testnet";
    }
});

Template.networkSwitch.events({
    'change .network':function(event,template){
        event.preventDefault();
        var theVal = $(event.target).val();
        console.log('changing network to '+theVal + '....');
        var config = Meteor.settings.public.rpc[theVal]
        web3.setProvider(config);
        Session.set('network',theVal);
        console.log('done.');
    }
});

Template.networkSwitch.onCreated(function () {
    //add your statement here
});

Template.networkSwitch.onRendered(function () {
    //add your statement here
});

Template.networkSwitch.onDestroyed(function () {
    //add your statement here
});
