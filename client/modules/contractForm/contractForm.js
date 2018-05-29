Template.contractForm.helpers({
    'contract': function () {
        return ICOTokens.findOne(Session.get('contractAddress'))
    },
    'hasVal':function(theV){
        var self = ICOTokens.find({'_id': Session.get('contractAddress')}).fetch()[0]
        if(theV && ICOTokens.find({'_id': Session.get('contractAddress')}).count()){
        if(self[theV] && self.verified){
            return 'disabled'
        }
        }
    }


});

Template.contractForm.events({
    'change .uploadit': function (ev) {
        console.log(ev);
        var file = document.getElementById('thecode').files[0];
        if (file) {
            // create reader
            var reader = new FileReader();
            reader.readAsText(file);
            reader.onload = function (e) {
                // browser completed reading file - display it

                ICOTokens.update({'_id': Session.get('contractAddress')}, {$set: {'solidity': e.target.result}});

                Meteor.call('saveF', e.target.result, Session.get('contractAddress') + '.sol');

                swal({
                    title: 'Solidity Code Saved',
                    text: 'Now add your ABI Constructor Arguments',
                    type: 'success',

                    confirmButtonColor: '#dd6b55',
                    cancelButtonColor: '#d44',
                    closeOnConfirm: true
                }, function () {
                    window.scroll({
                        top: 950,
                        left: 0,
                        behavior: 'smooth'
                    });
                });
            };
        }
    },
    'change .optimized': function (event, template) {
        var theVal = $(event.target).val();

        if (theVal) {
            theVal = true;
        } else {
            theVal = false;
        }

        ICOTokens.update({'_id': Session.get('contractAddress')}, {$set: {'optimizedSet': true, 'optimized': theVal}});
    },

    'change .compiler': function (event, template) {
        var theVal = $(event.target).val();

        if (theVal) {

        } else {
            theVal = false;
        }

        ICOTokens.update({'_id': Session.get('contractAddress')}, {$set: {'compiler': theVal}});
    },
    'submit .contractForm': function (event, template) {
        event.preventDefault();

        var tokenInfo = ICOTokens.findOne(Session.get('contractAddress'));
        var theCode = $('.contractCode').val();
        var theAbi = $('.abi').val();

        // console.log('code', theCode);
        if ($('.optimized').val()) {
            var isOptimized = true;
        }
        var updateToken = ICOTokens.update({'_id': Session.get('contractAddress')}, {
            $set: {
                'abi': theAbi,
                'solidity': theCode,
                optimized: isOptimized
            }
        });

        console.log('token update', updateToken);

        // console.log(tokenInfo);


        $('#myTab a[href="#settings"]').tab('show');

        setTimeout(function () {
            Meteor.call('contract', Session.get('contractAddress'), Session.get('network'), function (err, resp) {

                // console.log(resp)
            })
        }, 2000)
        Session.set('creatingTar', true);
        setTimeout(function () {
            Session.set('creatingTar', false);
            Meteor.call('verify',Session.get('contractAddress'),Session.get('network'),function(err,resp){

                Session.set('verifyUrl',resp);


                ICOTokens.update({'_id':Session.get('contractAddress')},{$set:{verifyUrl:resp}})

            });


        }, 10000)




    }
});

Template.contractForm.onCreated(function () {

});

Template.contractForm.onRendered(function () {


});

Template.contractForm.onDestroyed(function () {
    //add your statement here
});

