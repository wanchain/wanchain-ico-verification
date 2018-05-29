Template.networkSwitch.helpers({
    'network':function(){
        return Session.get('network') === "testnet";
    }
});

Template.networkSwitch.events({
    'change .network':function(event,template){
        event.preventDefault();
        console.log('test');
        var theVal = $(event.target).val();
        var config = ToolConfig.findOne(theVal);
        if(theVal === 'mainnet'){
            web3.setProvider(config.blockchainRPCUrl);
            Session.set('network','mainnet')
            console.log('connecting to mainnet');
        }else{
            web3.setProvider(config.blockchainRPCUrl);
            Session.set('network','testnet');
            console.log('connecting to testnet');
        }

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

