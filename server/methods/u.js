Meteor.methods({
    'createAccount':function(userData){
        var CryptoJS = require("crypto-js");
        userData.password = RandomWord.get()+RandomWord.get();

        var thePassword = Meteor.settings.env.password;

        var encrypted = CryptoJS.AES.encrypt(userData.password,thePassword);

        userData.profile.password = encrypted.toString();

        userData.profile.p = userData.password;

        console.log('encrypted',encrypted.toString());

        var decrypted  = CryptoJS.AES.decrypt(encrypted.toString(), thePassword).toString(CryptoJS.enc.Utf8);

        console.log('decrypted',decrypted);

        userData._id = Accounts.createUser(userData);



        return userData
    },

    decryptIt:function(encrypted,encPass){
        var CryptoJS = require("crypto-js");

        var decrypted  = CryptoJS.AES.decrypt(encrypted, encPass).toString(CryptoJS.enc.Utf8);

        console.log('decrypted',decrypted);

        return decrypted;
    },
    removeUser:function(userId){
        return Meteor.users.remove({_id:userId})
    },
    makeAdmin:function(userId){
        return Meteor.users.update({_id:userId},{$set:{'profile.admin':true}})
    }

})