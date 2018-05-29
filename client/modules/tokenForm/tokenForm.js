Template.tokenForm.helpers({
    'contractAddress': function () {
        if (Session.get('contractAddress')) {
            return ICOTokens.find({'_id': Session.get('contractAddress')}).fetch()[0] || false;
        }
    },
    'addy':function(){
        return Session.get('contractAddress')
    },
    'loading': function () {
        return Session.get('loading');
    },
    'path': function () {
        return Session.get('path');
    },
    'testnet': function () {
        return Session.get('network') === "testnet";
    },
    'net': function () {
        return Session.get('network');
    },
    'hasVal': function (theV) {
        if(theV && ICOTokens.find().count()){
        var self = ICOTokens.find({'_id': Session.get('contractAddress')}).fetch()[0]
        if (self[theV] && self.verified) {
            return 'readonly'
        }
        }
    }
});

Template.tokenForm.events({
    'change .icon-input': function (ev) {
        console.log(ev);

        var contractAddress = $('.contractAddress').val();

        _.each(ev.originalEvent.srcElement.files, function (file) {
            // console.log(file)
            file.name = contractAddress + '.' + file.name.split('.').pop().toLowerCase();


            var fileType = file["type"];
            var ValidImageTypes = ["image/jpeg", "image/png", "image/jpg"];
            if ($.inArray(fileType, ValidImageTypes) < 0) {
                console.log('is not image')

                swal({
                    title: 'Invalid Icon Format',
                    text: 'We only accept jpeg,png,jpg. Your file is ' + file.name.split('.').pop().toLowerCase(),
                    type: 'warning',

                    confirmButtonColor: '#dd6b55',
                    cancelButtonColor: '#d44',
                    closeOnConfirm: true
                }, function () {

                });
            } else {
                if ((file.size / 1000) < 301) {


                    console.log('is image!');
                    Meteor.saveFile(file, contractAddress + '.' + file.name.split('.').pop().toLowerCase(), contractAddress);
                    swal({
                        title: 'Icon Saved',
                        text: 'Your icon has been saved!',
                        type: 'success',

                        confirmButtonColor: '#dd6b55',
                        cancelButtonColor: '#d44',
                        closeOnConfirm: true
                    }, function () {

                    });
                    getBase64(file);
                    ICOTokens.update({'_id': contractAddress}, {$set: {'iconExtension': file.name.split('.').pop().toLowerCase()}})
                } else {
                    swal({
                        title: 'Icon Too Big',
                        text: 'The max image size for icons is 300k. Your image is ' + parseInt(file.size / 1000) + 'k',
                        type: 'warning',

                        confirmButtonColor: '#dd6b55',
                        cancelButtonColor: '#d44',
                        closeOnConfirm: true
                    }, function () {

                    });

                }

            }
            console.log(file)


        });
    },
    'click .check': function (event, template) {


        var theAddress = $('.address').val().split('.')[0];
        $('.address').val(theAddress);

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
                            Session.set('contractAddress', false);
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
    },
    'submit .tokenForm': function (event, template) {
        event.preventDefault();
        console.log('submitting token form...');

        if (!ICOTokens.findOne(Session.get('contractAddress')).icon) {
            swal({
                title: 'Missing Icon',
                text: 'You must upload an icon',
                type: 'warning',

                confirmButtonColor: '#dd6b55',
                cancelButtonColor: '#d44',
                closeOnConfirm: true
            }, function () {
                //$('#myTab a[href="#profile"]').tab('show');
            });

            return false
        } else {


        }
        var tokenObj = {};
        tokenObj.submittedOn = new Date();
        var formObj = $(event.target).serializeArray();
        _.each(formObj, function (e) {
            tokenObj[e.name] = e.value || false;
        });

        tokenObj.decimals = parseFloat(tokenObj.decimals || 0);
        tokenObj.totalSupply = parseFloat(tokenObj.totalSupply || 0);

        Session.set('tokenObj', tokenObj);


        var file = {
            name: tokenObj.contractAddress + '.json',
            file: tokenObj,
        };


        Meteor.call('saveJson', tokenObj, file.name);


        ICOTokens.update({_id: tokenObj.contractAddress}, {$set: tokenObj});
        $('#myTab a[href="#profile"]').tab('show');

        // swal({
        //     title: 'Token Info Saved',
        //     text: 'Lets add your contract code!',
        //     type: 'success',
        //
        //     confirmButtonColor: '#dd6b55',
        //     cancelButtonColor: '#d44',
        //     closeOnConfirm: true
        // }, function() {
        //
        // });



    },
    'click .reset': function (event, template) {
        event.preventDefault();
        Session.set('contractAddress', false);
        Session.set('loading', false);

    }
});

Template.tokenForm.onCreated(function () {
    // Session.set('contractAddress', false);
    Session.set('loading', false);

    getBase64 = function (file) {
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            // console.log(reader.result);
            ICOTokens.update({'_id': Session.get('contractAddress')}, {$set: {'icon': reader.result}});
        };
        reader.onerror = function (error) {
            console.log('Error: ', error);
        };
    }






});

Template.tokenForm.onRendered(function () {

});

Template.tokenForm.onDestroyed(function () {
    //add your statement here
});

