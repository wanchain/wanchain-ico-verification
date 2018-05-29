Meteor.methods({

    'contract': function (contractAddress, network) {
        var Web3 = require('web3');
        var web3 = new Web3(new Web3.providers.HttpProvider(Meteor.settings.public.rpc[network]));
        var contractObj = ICOTokens.findOne(contractAddress);

        match = false;

        theSources = {};

        theSources[contractAddress + '.sol'] = ICOTokens.findOne(contractAddress).solidity;

        console.log('contract obj', contractObj);

        var input = {
            // Required: Source code language, such as "Solidity", "serpent", "lll", "assembly", etc.
            language: "Solidity",

            sources: theSources,
            // Optional
            "compiler": {
                "version": contractObj.compiler || false,
            },
            settings:
                {
                    optimizer: {
                        enabled: contractObj.optimized,
                        runs: 200
                    },

                    evmVersion: "byzantium", // Version of the EVM to compile for. Affects type checking and code generation. Can be homestead, tangerineWhistle, spuriousDragon, byzantium or constantinople
                    outputSelection: {
                        // Enable the metadata and bytecode outputs of every single contract.
                        "*": {
                            "*": ["metadata", "evm.bytecode"]
                        },
                        // Enable the abi and opcodes output of MyContract defined in file def.
                        "def": {
                            "Counter": ["abi", "evm.bytecode.opcodes", "evm.bytecode"]
                        },
                        // Enable the source map output of every single contract.
                        "*": {
                            "*": ["evm.bytecode.sourceMap"]
                        },
                        // Enable the legacy AST output of every single file.
                        "*": {
                            "": ["legacyAST"]
                        }
                    }
                }
        }

        if (contractObj.optimized) {
            var opt = 1
        } else {
            var opt = 0
        }
        var output = solc.compile(input, opt); // 1 activates the optimiser
        var thecode = ''
        web3.eth.getCode(contractAddress.toUpperCase(), function (err, resp) {
            var blockchainCode = resp.split('0x')[1].split('a165627a7a72305820')[0];
            for (var contractName in output.contracts) {
                // code and ABI that are needed by web3

                console.log(output.contracts[contractName].bytecode)
                if (!match) {
                    var compiledCode = output.contracts[contractName].bytecode.split('a165627a7a72305820')[0];
                    thecode = thecode + compiledCode;
                    if (compiledCode.split('f300').length > 1) {

                        compiledCode = compiledCode.split('f300')[1];

                    } else {
                        compiledCode = compiledCode;
                    }

                    console.log('1', blockchainCode);
                    console.log('2', thecode.split('f300')[1]);
                    console.log('2', compiledCode);

                    if (compiledCode === blockchainCode && compiledCode.indexOf(blockchainCode) !== -1) {

                        match = true;

                        Fiber(function () {

                            ICOTokens.update({'_id': contractAddress}, {$set: {verifyattempt: true, verified: true}})

                            sleep(3000);

                            Meteor.call('saveF', contractObj.solidity, contractAddress + '.sol');
                            Meteor.call('saveF', contractObj.abi, contractAddress + '.abi');
                            Meteor.call('createTar', contractAddress);

                        }).run()

                    } else {

                        console.log('no match......')

                        Fiber(function () {
                            //TickerStats.remove({'_id':'LTC'});

                            //sleep(2000);
                            //TickerStats.insert({'_id':'LTC'})
                            sleep(2000);

                            if (!match) {
                                ICOTokens.update({'_id': contractAddress}, {
                                    $set: {
                                        verifyattempt: true,
                                        verified: false
                                    }
                                });
                                console.log('does it match')
                            } else {
                                console.log('we got ourselves a match ladies and gentlemen')
                            }
                        }).run();


                    }

                }
                else {
                    console.log('WE HAVE A MATCH!!!')
                }


            }

        });


    },
    'verify': function (contractAddress, theNet) {
        var CryptoJS = require("crypto-js");

        var encrypted = CryptoJS.AES.encrypt(contractAddress, contractAddress.toLowerCase() + password);

        console.log('encrypted', encrypted.toString());

        var password = Meteor.settings.env.password;

        var explorerApiUrl = Meteor.settings.env.explorerApiUrl;

        var decrypted = CryptoJS.AES.decrypt(encrypted.toString(), contractAddress.toLowerCase() + password).toString(CryptoJS.enc.Utf8);

        console.log('decrypted', decrypted);

        var theUrl = explorerApiUrl + '/' + contractAddress + '/' + encodeURIComponent(encrypted.toString());

        console.log(theUrl);

        return theUrl

    },
    'decrypt': function (encrypted) {
        var CryptoJS = require("crypto-js");

        var decrypted = CryptoJS.AES.decrypt(encrypted.toString(), contractAddress.toLowerCase() + Meteor.settings.env.password).toString(CryptoJS.enc.Utf8);

        console.log('decrypted', decrypted);

    },
    'pingExplorer': function (contractAddress) {
        var theUrl = ICOTokens.findOne(contractAddress).verifyUrl;
        return HTTP.get(theUrl);
    }
})