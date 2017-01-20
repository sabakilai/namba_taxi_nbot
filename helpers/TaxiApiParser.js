var request = require('request');

/*Local modules*/
var db = require(__dirname + '/../models/db');
var sendMessage = require(__dirname + '/sendMessage');
var token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MTIxLCJwaG9uZSI6IjA1NTk5NzYwMDAiLCJwYXNzd29yZCI6IjMxMDU3ZjUyMTU4MDkxMGI2ZWY3MjVjZmU1NzU4NGMyIiwiaWF0IjoxNDc0NzEzNTkzfQ.zUxl-bjFE84GWUW7m-u1UUYkF6N4stN5KmfC9mnBs7w';
var template = require(__dirname + '/templates');
var async = require('async');

var fares = 'https://staging.swift.kg/api/v1/fares/';
var payment = 'https://staging.swift.kg/api/v1/payment-methods/';
var options = 'https://staging.swift.kg/api/v1/request-options/';
var order = 'https://staging.swift.kg/api/v1/requests/';

exports.fares = function(callback)
{
	let data
	request.post({url: fares, form: {partner_id: 1,server_token: 'RcQ5tP1VsD6u0jt0hou5vFOqmXyrBA8V'}}, function(err,res,body){
		data = JSON.parse(body);
		data = data.fares;
		var fares = [];
		for(let key in data)
		{
			let obj = {
				"name": data[key].name,
				"flagfall": data[key].flagfall,
				"cost_per_kilometer": data[key].cost_per_kilometer
			}
			fares.push(obj);
		}
		if(callback)
		{
			callback(fares);
		}
	});
}
