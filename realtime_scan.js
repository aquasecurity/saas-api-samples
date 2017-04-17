var crypto = require('crypto');
var moment = require('moment');
var request = require('request');
var fs = require('fs');

// CHANGE THESE
var key = '<cloudsploit-key>';
var secret = '<cloudsploit-secret>';
var keyId = 1234;	// The key_id you want to scan (obtain this via GET /keys)

// Do not change this
var baseUrl = 'https://api.cloudsploit.com';
var interval = 5000;

var makeCall = function(method, path, query, body, callback) {
	var timestamp = (moment.unix(new Date()))/1000;
	var endpoint = baseUrl + path;

	var string = timestamp + method + path +
				(body && Object.keys(body).length > 0 ? JSON.stringify(body) : '');

	var hmac = crypto.createHmac('sha256', secret);
	hmac.setEncoding('hex');
	hmac.write(string);
	hmac.end();
	var signature = hmac.read();

	var options = {
		method: method,
		url: endpoint,
		headers: {
			'Accept': 'application/json',
			'X-API-Key': key,
			'X-Signature': signature,
			'X-Timestamp': timestamp,
			"content-type": "application/json"
		}
	};

	if (body) options.json = body;

	console.log(JSON.stringify(options,null,2));

	request(options, function (error, response, body){
		if (error) return callback(error);
		// Uncomment this to see detailed response information
		//console.log(JSON.stringify(response));
		callback(null, body);
	});
};

var body = {
	key_id: keyId
};

makeCall('POST', '/v2/realtimes', '', body, function(err, data){
	if (err) return console.log(err);
	console.log(data);

	setInterval(function(){
		makeCall('GET', '/v2/realtimes/' + data.data.realtime_id.toString(), '', null, function(gErr, gData){
			if (gErr) return console.log(gErr);
			console.log(gData);
		});
	}, interval);
});