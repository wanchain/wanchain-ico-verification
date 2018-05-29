Meteor.methods({
    'getFile':function(contractId){
        return Assets.absoluteFilePath('.uploads/'+contractId+'.png')
    },
    'getPath':function(){
        return __meteor_bootstrap__.serverDir.split(/(\\|\/).meteor/)[0] + '/.uploads/';
    },
    'getToken':function(tokenId){
        return ICOTokens.find({'_id':tokenId}).count()
    },
    'removeToken':function(tokenId){
        console.log('removing',tokenId)
        return ICOTokens.remove({'_id':tokenId})
    },
})