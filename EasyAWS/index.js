// var SecurityGroup = require('./secgroup.js');
var AWS = require('aws-sdk');
var ec2 = null;

module.exports.Setup = function(credentials){
	AWS.config.update({accessKeyId: credentials.accessKeyId, secretAccessKey: credentials.secretAccessKey});
	AWS.config.region = credentials.region;
	ec2 = new AWS.EC2();
}

module.exports.RequestSecurityGroups = function(callback){
	ec2.describeSecurityGroups( function(err, data) {
		callback(err, data.SecurityGroups);
	});
}

module.exports.SecurityGroup = function(raw){
	// console.log(raw)
	this.raw = raw;
	this.getNameTag = function(){
		var name = null;
		var set = 0;
		for(var t in raw.Tags){
			if(raw.Tags[t].Key == 'Name'){
				name = raw.Tags[t].Value;
				set = 1;
			}
		}
		if(!set){
			name = raw.GroupName;
		}
		return name;
	}
	this.getIpPermissionsIngress = function(){
		return raw.IpPermissions;
	}

	this.getIpPermissionsEgress = function(){
		return raw.IpPermissionsEgress;
	}

	this.getGroupId = function() {
		return raw.GroupId;
	}

	this.AllowIpPort = function(ip, port, protocol, callback){
		var params = {
		  CidrIp: ip,
		  FromPort: port,
		  GroupId: this.getGroupId(),
		  IpProtocol: protocol,
		  ToPort: port
		};
		ec2.authorizeSecurityGroupIngress(params, function(err, data) {
		  callback(err, data);
		});
	}

	this.RemoveAllowedIpPort = function(ip, port, protocol, callback){
		var params = {
		  CidrIp: ip,
		  FromPort: port,
		  GroupId: this.getGroupId(),
		  IpProtocol: protocol,
		  ToPort: port
		};
		ec2.revokeSecurityGroupIngress(params, function(err, data) {
		  callback(err, data);
		});
	}
	return this;
}
