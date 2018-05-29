Meteor.methods({
    'parseContract':function(contractAddress,network){
        var Web3 = require('web3');
        var web3 = new Web3(new Web3.providers.HttpProvider(ToolConfig.findOne(network).blockchainRPCUrl));
        var contractObj = ICOTokens.findOne(contractAddress);
        var tokenContract = new web3.eth.Contract(JSON.parse(Assets.getText('standardToken.abi').replace(/\n/g, '')),contractAddress.toUpperCase());

        // console.log(tokenContract)


        console.log('calling parse contract')

// Get the token name
        tokenContract = tokenContract.methods;


        tokenContract.name.call (function(err, name){
            if(err) {
                console.log(err);
            } else {
                console.log('The token name is: ' + name);
            }
        })

// Get the token symbol
        tokenContract.symbol.call (function(err, symbol) {
            if(err) {
                console.log(err);
            } else {
                console.log('Token symbol: ' + symbol);
            }
        })

// Get the token total supply
        tokenContract.totalSupply.call (function(err, totalSupply) {
            if(err) {
                console.log(err);
            } else {
                console.log('Token total supply: ' + totalSupply.div(1e18));
            }
        })

//Get token balance
//         tokenContract.balanceOf.call (tokenHolderAddress, function(err, balance){
//             if(err) {
//                 console.log(err);
//             } else {
//                 console.log('The balance is: ' + balance.div(1e18));
//             }
//         })

    }
})