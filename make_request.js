// This Node script will submit a GET to the
// scans API endpoint to obtain a list of
// available scans

var crypto = require('crypto');
var moment = require('moment');
var request = require('request');
 
var key = '<cloudsploit-key>';
var secret = '<cloudsploit-secret>';
var endpoint = 'https://4ija8kqhm7.execute-api.us-east-1.amazonaws.com/prod';
var path = '/v2/scans';
var timestamp = (moment.unix(new Date()))/1000;
 
var string = timestamp + 'GET' + path;
 
var hmac = crypto.createHmac('sha256', secret);
hmac.setEncoding('hex');
hmac.write(string);
hmac.end();
var signature = hmac.read();
 
var options = {
    method: 'GET',
    url: endpoint + path,
    headers: {
        'X-API-Key': key,
        'X-Signature': signature,
        'X-Timestamp': timestamp,
        "Content-Type": "application/json"
    }
};
 
request(options, function (error, response, body){
    if (error) return console.log(error);
    console.log(JSON.stringify(response));
});