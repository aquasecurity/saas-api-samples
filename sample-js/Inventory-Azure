// This script will quantify resources available in the Azure subscriptions configured in Aqua CSPM

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
                    if (key.cloud === 'azure') {
						var AzureResourceToCollect = {
							'microsoft.storage/storageaccounts': 0,
							'microsoft.network/virtualnetworks': 0,
							'microsoft.sql/servers': 0,
							'microsoft.web/sites': 0,
							'microsoft.network/networksecuritygroups': 0,
							'microsoft.authorization/policyassignments': 0,
							'microsoft.authorization/policydefinitions': 0,
							'microsoft.network/networkwatchers': 0,
							'microsoft.security/securitycontacts': 0,
							'microsoft.security/autoprovisioningsettings': 0,
							'microsoft.compute/virtualmachines': 0,
							'microsoft.keyvault/vaults': 0,
							'microsoft.insights/activitylogalerts': 0,
							'microsoft.compute/disks': 0,
							'microsoft.containerservice/managedclusters': 0,
							'microsoft.insights/logprofiles': 0,
							'microsoft.cdn/profiles': 0,
							'microsoft.authorization/roledefinitions': 0,
							'microsoft.authorization/locks': 0,
							'microsoft.network/loadbalancers': 0,
							'microsoft.containerregistry/registries': 0,
							'microsoft.security/pricings': 0,
							'microsoft.compute/availabilitysets': 0,
							'microsoft.compute/virtualmachinescalesets': 0,
							'microsoft.insights/autoscalesettings': 0,
							'microsoft.insights/diagnosticsettings': 0,
							'microsoft.dbformysql/servers': 0,
							'microsoft.dbforpostgresql/servers': 0,
						}
                        resourcesToCollect = AzureResourceToCollect;
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
