var request = require('request');

/*Local modules*/
var sendMessage = require(__dirname + '/sendMessage');
var template = require(__dirname + '/template');
var async = require('async');

var fares = 'https://staging.swift.kg/api/v1/fares/';
var payment = 'https://staging.swift.kg/api/v1/payment-methods/';
var options = 'https://staging.swift.kg/api/v1/request-options/';
var order = 'https://staging.swift.kg/api/v1/requests/';

exports.fares = function(callback)
{
	let data
	request.post({url: fares, form: {partner_id: 2,server_token: ' jOoALtG35L9A4HC15dOGUTco2lqJcrz1'}}, function(err,res,body){
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


exports.order = function(phone_number, address, fare, callback)
{
	fare ++;
	let data;
	request.post({url: order, form: {phone_number: phone_number,address: address,fare: fare, partner_id: 1,server_token: 'RcQ5tP1VsD6u0jt0hou5vFOqmXyrBA8V'}}, function(err,res,body){
		data = JSON.parse(body);
		if(callback)
		{
			callback(data);
		}
	});
}

exports.payment = function(callback)
{
	let data
	request.post({url: payment, form: {partner_id: 1,server_token: 'RcQ5tP1VsD6u0jt0hou5vFOqmXyrBA8V'}}, function(err,res,body){
		data = JSON.parse(body);
		if(callback)
		{
			callback(data);
		}
	});
}

exports.options = function(callback)
{
	let data
	request.post({url: options, form: {partner_id: 1,server_token: 'RcQ5tP1VsD6u0jt0hou5vFOqmXyrBA8V'}}, function(err,res,body){
		data = JSON.parse(body);
		if(callback)
		{
			callback(data);
		}
	});
}

exports.getFareId = function(value,fareData)
{
	for(let key in fareData)
	{
		if(fareData[key].name == value)
			return key;
	}
	return false;
}


//input status name
//returns status number or -1
var convertStatusName = function(name)
{
	var temp = ['Новый заказ','Принят','Ложный заказ','Выполнен','Клиент на борту','Машина на месте','Отклонен','Ожидание','Следующий заказ'];
	for(let key in temp)
	{
		if(temp[key] == name)
			return key;
	}
	return -1;
}