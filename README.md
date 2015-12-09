EasyAWS
===================

This is simple node module to abstract away some of the finer details of the AWS SDK.  Only the features I need are built at the moment.

**Examples**

    var EAWS = require('./EasyAWS');
    
    
    var creds = {accessKeyId: 'YOURK_KEY_ID', secretAccessKey: 'YOUR_KEY', region: 'us-east-1'};
    
    EAWS.Setup(creds);
    EAWS.RequestSecurityGroups(function(err, data){
    	for(var g in data){
    		var sg = EAWS.SecurityGroup(data[g]);
    		console.log(sg.getGroupId())
    	}
    })