Meteor.publish('tokens',function(contractAddress){
    if(contractAddress){
        return ICOTokens.find({'_id':contractAddress});
    }
});


Meteor.publish('toolconf',function(contractAddress){
  return ToolConfig.find();
});


Meteor.publish('users',function(contractAddress){
    return Meteor.users.find({'profile.icoUser':true})
});

