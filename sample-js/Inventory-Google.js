// This script will quantify resources available in the Google Projects subscriptions configured in Aqua CSPM

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
			async.eachLimit(bodyObj.data, 10, function(key,  kCb) {
				if (key.id) {
                    let resourcesToCollect; 
                    if (key.cloud === 'google') {
						var GoogleResourceToCollect = {
							'/compute/v1/projects/{project}/zones/{zone}/instances/{resourceId}': 0,
							'/datasets/': 0,           
							'/backendServices/': 0,    
							'/instanceGroups/': 0,     
							'/instances/': 0,          
							'/disks/': 0,              
							'/keyRings/': 0,           
							'/cryptoKeys/': 0,         
							'/zones/': 0,              
							'/serviceAccounts/': 0,    
							'/keys/': 0,               
							'/clusters/': 0,           
							'/alertPolicies/': 0,      
							'/sinks/': 0,              
							'/topics/': 0,             
							'/instances/': 0,          
							'/b/': 0,                  
							'/networks/': 0,           
							'/subnetworks/': 0,        
							'/firewalls/': 0           
						}
                        resourcesToCollect = GoogleResourceToCollect;
                    } else {
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
				console.log(fullResourceObj);
			})
		}
	
	});
}
collect();
