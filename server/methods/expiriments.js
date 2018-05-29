Meteor.methods({
    'validateContract':

        function (contractAddress) {

            var Web3 = require('web3');
            var web3 = new Web3();
            var blockchainRPCUrl = Meteor.settings.env.blockchainRPCUrl;
            var web3 = new Web3(new Web3.providers.HttpProvider(blockchainRPCUrl));

            console.log('calling contract validation method...')
            //path = __meteor_bootstrap__.serverDir.split(/(\\|\/).meteor/)[0] + '/private/icos/';

            var theSol = Assets.getText('icos/' + contractAddress + '.sol');
            var theByte = Assets.getText('icos/' + contractAddress + '.byte');
            var theAbi = Assets.getText('icos/' + contractAddress + '.abi');
            var theJson = Assets.getText('icos/' + contractAddress + '.json');

            var theContract = {};

            theContract.sol = theSol;
            theContract.byte = theByte;
            theContract.abi = theAbi;
            theContract.json = theJson;

            var sampleContract = new web3.eth.Contract(JSON.parse(theContract.abi));

            var myContract = sampleContract;

            var ab = myContract;


            console.log(ab)


        }


})