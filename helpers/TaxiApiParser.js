var request = require('request');

/*Local modules*/
var sendMessage = require(__dirname + '/sendMessage');
var template = require(__dirname + '/template');
var async = require('async');

var fares = 'https://staging.swift.kg/api/v1/fares/';
var payment = 'https://staging.swift.kg/api/v1/payment-methods/';
var options = 'https://staging.swift.kg/api/v1/request-options/';
var order = 'https://staging.swift.kg/api/v1/requests/';

var partner_id = 2;
var server_token = 'jOoALtG35L9A4HC15dOGUTco2lqJcrz1';

/* Models */
var Status = require('../models/status');

exports.fares = function(callback)
{
	let data
	request.post({url: fares, form: {partner_id: partner_id,server_token: server_token}}, function(err,res,body){
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
	request.post({url: order, form: {phone_number: phone_number,address: address,fare: fare, partner_id: partner_id,server_token: server_token}}, function(err,res,body){
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
	request.post({url: payment, form: {partner_id: 2,server_token: server_token}}, function(err,res,body){
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
	request.post({url: options, form: {partner_id: 2,server_token: server_token}}, function(err,res,body){
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

//update statuses every 15 sec.
exports.updateStatuses = function()
{
	Status.find({status : { $gt: 0 }}, function(err, statuses){
		async.eachSeries(statuses, function iteratee(item, cb)
		{	
			console.log(item.order_id);
			console.log('--------------------------------');

			let url = order + item.order_id + '/';
			request.post({url: url, form: {partner_id: partner_id,server_token: server_token}}, function(err,res,body){
				data = JSON.parse(body);
				var statusNumber = convertStatusName(data.status);
				
				console.log("curr statusNumber");
				console.log(statusNumber);
				console.log("previous");
				console.log(item.status);
				
				/*If status changed then send apropriate message to user*/
				if(item.status != statusNumber)
				{
					if(statusNumber == 1)
					{
						sendMessage(item.api_url, template.driverGetOrder(data.driver), item.chat_id, token);
					}
					else if(statusNumber == 2)
					{
						sendMessage(item.api_url,' Заказ помечен водителем, как ложный.', item.chat_id, token);
					}
					else if(statusNumber == 3)
					{
						sendMessage(item.api_url, 'Заказ завершен.', item.chat_id, token);
					}
					else if(statusNumber == 5)
					{
						sendMessage(item.api_url, template.carOnPlace(data.driver), item.chat_id, token);
					}
					else if(statusNumber == 6)
					{
						sendMessage(item.api_url, 'Заказ отменен.', item.chat_id, token);
					}
					else if(statusNumber == 8)
					{
						sendMessage(item.api_url, 'Водитель поедет в вам, как только закончит текущий заказ.', item.chat_id, token);
					}
					
				}
				item.status = statusNumber;
				Status.update({chat_id: item.chat_id}, item, null, function() {
					cb();		
				});
			});
		}, function done() {
			//callback do nothing.
		});
	});
}