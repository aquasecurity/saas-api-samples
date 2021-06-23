// This script will quantify resources available in the AWS accounts configured in Aqua CSPM

var async = require('async');
var crypto = require('crypto');
var moment = require('moment');
var request = require('request');
 
var key = 'Aqua-API-Key';
var secret = 'Aqua-API-Secret';
var baseUrl = 'https://api.cloudsploit.com';

fullResourceObj = {};
function createRequest(path, method, queryStringParams) {
	var timestamp = (moment.unix(new Date()))/1000;
	var string = timestamp + method + path;
	
	var hmac = crypto.createHmac('sha256', secret);
	hmac.setEncoding('hex');
	hmac.write(string);
	hmac.end();
	var signature = hmac.read();

	var options = {
		method: method,
		url: baseUrl + path + (queryStringParams ? queryStringParams : ''),
		headers: {
			'Accept': 'application/json',
			'X-API-Key': key,
			'X-Signature': signature,
			'X-Timestamp': timestamp,
			"content-type": "application/json"
		}
	}
	return options;
}

function collect() {
	var options = createRequest('/v2/keys', 'GET');
	// this is getting all keys from account/group
	request(options, function (error, response, body){
		if (error || !body) return callback(error || 'No response body');
		var bodyObj = JSON.parse(body);
		if (bodyObj && bodyObj.data) {
			// looping through keys
			async.eachLimit(bodyObj.data, 15, function(key,  kCb) {
				if (key.id) {
                    // if adding a new cloud update here.
                    let resourcesToCollect; 
                    if (key.cloud === 'aws') {
						var AWSResourcesToCollect = {
							':s3:': 0, 
							':ec2:': 0,
							':rds:': 0,
							':cloudfront:': 0,
                            ':eks:': 0,
							':ecr:': 0,
                            'elasticloadbalancing:': 0,
							':sns:': 0,
							':sqs:': 0,
							':dynamodb:': 0,
						}
                        resourcesToCollect = AWSResourcesToCollect;
                    } 
                    else 
                    {
                        return kCb();
                    }
					fullResourceObj[key.name] = {};
					// this is to get usage for a specific key
					let usageOptions = createRequest('/v2/usage', 'GET', `?key_id=${key.id}`);
					request(usageOptions, function(uErr, uResp, uBody) {
						if (uErr || !uBody) {
							console.log(uErr || `No Usage response from key: ${key.name}`);
							return kCb();
						}
						var uBodyObj = JSON.parse(uBody);
						
						async.each(Object.keys(resourcesToCollect), function(resourceIdentifier, rCb) {
							uBodyObj.data.forEach(resource => {
							    if (resource.includes(resourceIdentifier)) {
									resourcesToCollect[resourceIdentifier]++;
								}
							})
							rCb();
						}, function() {
							fullResourceObj[key.name] = resourcesToCollect;
							return kCb();
						}) 
					
					})
				}
			}, function() {
				// this is the final part of the whole function
				console.log(fullResourceObj);
			})
		}
	
	});
}
collect();
