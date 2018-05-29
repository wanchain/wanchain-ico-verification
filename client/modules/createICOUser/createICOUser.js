Template.createICOUser.helpers({
    users:function(){
        return Meteor.users.find({'profile.icoUser':true},{sort:{'profile.createdOn':-1}})
    }
});

Template.createICOUser.events({
    'submit .createUser':function(event,template){
        event.preventDefault();

        var formObj = $(event.target).serializeArray();
        var uObj = {};

        _.each(formObj,function(e){
            uObj[e.name] = e.value;
        });



        uObj.profile = {};
        uObj.profile.icoUser=true;
        uObj.profile.createdOn = new Date();

        console.log('userObj 2',uObj);

        // userObj.password='H&@UxC{rbUeKL~4e';
        Meteor.call('createAccount',uObj,function(err,resp){
            console.log(resp);
        })
    },
    'click .decrypt':function(event,template){
        event.preventDefault();
        var self = this;
        var encKey = prompt('enter encryption password');
        Meteor.call('decryptIt',self.profile.password,encKey,function(err,resp){
            console.log(resp);
            if(resp){
            alert('password: '+resp)
            }else{
                alert('invalid decryption password')
            }
        });
    }
});

Template.createICOUser.onCreated(function () {
    Meteor.subscribe('users');
});

Template.createICOUser.onRendered(function () {
    //add your statement here
});

Template.createICOUser.onDestroyed(function () {
    //add your statement here
});

