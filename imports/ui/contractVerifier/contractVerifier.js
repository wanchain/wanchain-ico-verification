import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { ICOTokens } from '../../startup/lib/collections';

import './contractVerifier.html';
import '../tokenForm/tokenForm.js';

Template.contractVerifier.helpers({
    'contract':function(){
        return ICOTokens.findOne(Session.get('contractAddress'))
    },
    'creatingTar':function(){
        return Session.get('creatingTar');
    },
    'network':function(){
        return Session.get('network');
    },
    'conf':function(){
        return ToolConfig.find({'_id':Session.get('network')}).fetch()
    }
});

Template.contractVerifier.events({
    'click .pingMe':function(event,template){
        event.preventDefault();

        Meteor.call('pingExplorer',Session.get('contractAddress'),Session.get('network'),function(err,resp){
            console.log(err,resp);
        })


    },
    'click .editContract':function(event,template){
        event.preventDefault();
        ICOTokens.update({'_id':Session.get('contractAddress')},{$set:{ explorersuccess:false,verified:false}});
        $('#myTab a[href="#home"]').tab('show');
    }
});

Template.contractVerifier.onCreated(function () {
    if(Session.get('params') && Session.get('params').a){
        var theAddress = Session.get('params').a;
        Session.set('loading', false);

        if (theAddress) {


            theObj = {
                _id: theAddress,
                lastEdited: new Date()
            }


            Session.set('loading', {message: '<i class="fa fa-spin fa-spinner"></i> getting contract code from blockchain... '});


            Session.set('contractAddress', theAddress);


            if (web3.utils.isAddress(Session.get('contractAddress').toUpperCase())) {

                web3.eth.getCode(theAddress.toUpperCase(), function (err, res) {



                    //console.log(res);
                    if (err) {
                        Session.set('loading', {
                            class: 'danger',
                            message: '<i class="fa  fa-warning"></i>  contract not found'
                        });
                    } else {

                        if (res && res.length > 4) {


                            Meteor.call('getToken', Session.get('contractAddress'), function (err, resp) {



                                if (resp === 0) {

                                    theObj.user = Meteor.user();
                                    ICOTokens.insert(theObj);
                                    console.log('inserting token',theObj)

                                } else {

                                }




                                Session.set('loading', {
                                    class: 'success',
                                    message: '<i class="fa  fa-check"></i>  found contract ' + Session.get('contractAddress')
                                });
                                var tokenO = ICOTokens.find({'_id': theAddress}).fetch()
                                if (tokenO) {
                                    tokenObj = tokenO[0];

                                    var contractAddress = Session.get('contractAddress');
                                    var tokenContract = new web3.eth.Contract(standardAbi, contractAddress.toUpperCase());
                                    // console.log('token contract', tokenContract);
                                    tokenContract = tokenContract.methods;


                                    if (tokenContract) {
                                        tokenContract.name().call().then(function (resp) {
                                            if (resp) {
                                                ICOTokens.update({_id: theAddress}, {$set: {name: resp}});
                                                console.log('name', resp);
                                                Meteor.call('saveF', res, Session.get('contractAddress') + '.byte')
                                                console.log('saving file')
                                            }

                                        }).catch(function (err) {

                                            if (err) {

                                                return true
                                            }

                                        }).then(function (resp) {
                                            if (resp) {
                                                Session.set('loading', {
                                                    class: 'danger',
                                                    message: '<i class="fa  fa-warning"></i> the address you entered is not a valid token contract'
                                                });

                                                swal({
                                                    title: 'Invalid Contract',
                                                    text: 'The address you entered is not a valid token contract',
                                                    type: 'warning',

                                                    confirmButtonColor: '#dd6b55',
                                                    cancelButtonColor: '#d44',
                                                    closeOnConfirm: true
                                                }, function () {

                                                    Meteor.call('removeToken',Session.get('contractAddress'),function(err,resp){
                                                        console.log('removed token',resp);
                                                        Session.set('contractAddress',false);
                                                    })
                                                });

                                            } else {
                                                tokenContract.symbol().call().then(function (resp) {
                                                    if (resp) {
                                                        console.log('symbol', resp);
                                                        ICOTokens.update({_id: theAddress}, {$set: {symbol: resp}});
                                                    }

                                                }).then(function () {
                                                    tokenContract.totalSupply().call().then(function (resp) {
                                                        if (resp) {
                                                            console.log('totalSupply', resp);
                                                            ICOTokens.update({_id: theAddress}, {$set: {totalSupply: resp}});
                                                        }

                                                    }).then(function () {
                                                            tokenContract.decimals().call().then(function (resp) {
                                                                if (resp) {
                                                                    console.log('decimals', resp);
                                                                    ICOTokens.update({_id: theAddress}, {$set: {decimals: resp}});
                                                                }

                                                            })
                                                        }
                                                    )
                                                })
                                            }
                                        });


                                    }


                                    console.log('updating');
                                } else {
                                    // theObj._id = theAddress;
                                    // theObj.blockchain = {};
                                    // theObj.blockchain.bytecode = res;
                                    //
                                    // //ICOTokens.upsert({_id: theAddress}, theObj);
                                    // console.log('inserting');
                                }


                            })


                        } else {
                            Session.set('contractAddress', Session.get('params').a);
                            Session.set('loading', {
                                class: 'danger',
                                message: '<i class="fa  fa-warning"></i>  contract not found'
                            });

                            swal({
                                title: 'Contract Not Found',
                                text: 'The contract was not found',
                                type: 'warning',

                                confirmButtonColor: '#dd6b55',
                                cancelButtonColor: '#d44',
                                closeOnConfirm: true
                            }, function () {

                            });


                        }
                    }
                });
            } else {
                Session.set('loading', {
                    class: 'danger',
                    message: '<i class="fa  fa-warning"></i> the address you entered is not a valid address'
                });

                swal({
                    title: 'Invalid Address',
                    text: 'The address you entered is not a valid address',
                    type: 'warning',

                    confirmButtonColor: '#dd6b55',
                    cancelButtonColor: '#d44',
                    closeOnConfirm: true
                }, function () {

                });
            }


        } else {
            alert('you must enter a valid contract address!')
        }
    }
});

Template.contractVerifier.onRendered(function () {
    //add your statement here
});

Template.contractVerifier.onDestroyed(function () {
    //add your statement here
});
