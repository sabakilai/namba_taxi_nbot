var request = require('request');

/*Local modules*/
var sendMessage = require(__dirname + '/sendMessage');
var template = require(__dirname + '/template');
var async = require('async');

var fares = 'https://partners.swift.kg/api/v1/fares/';
var payment = 'https://partners.swift.kg/api/v1/payment-methods/';
var options = 'https://partners.swift.kg/api/v1/request-options/';
var order = 'https://partners.swift.kg/api/v1/requests/';

var partner_id = 22;
var server_token = 'uM5B2I4tNs8vuquiUQirUin0Z3anE599';
var token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MTIxLCJwaG9uZSI6IjA1NTk5NzYwMDAiLCJwYXNzd29yZCI6IjMxMDU3ZjUyMTU4MDkxMGI2ZWY3MjVjZmU1NzU4NGMyIiwiaXNCb3QiOnRydWUsImNvdW50cnkiOnRydWUsImlhdCI6MTQ4NTMzMDY4M30.d7GPBHrS6dY5OzYEf4skDaAfMasIAO4SfkEP4RS9fw8';

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
	request.post({url: payment, form: {partner_id: partner_id,server_token: server_token}}, function(err,res,body){
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
	request.post({url: options, form: {partner_id: partner_id,server_token: server_token}}, function(err,res,body){
		data = JSON.parse(body);
		if(callback)
		{
			callback(data);
		}
	});
}

exports.getFareId = function(value,fareData)
{
	var temp = [1, 11, 21, 2382];
	for(let key in fareData)
	{
		if(fareData[key].name == value)
			return temp[key];
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
	Status.find({status : { $gte: 0 }}, function(err, statuses){

		console.log();
		console.log();
		console.log();

		async.eachSeries(statuses, function iteratee(item, cb)
		{	
			console.log(item.order_id);
			console.log('--------------------------------');
			let url = order + item.order_id + '/';
			request.post({url: url, form: {partner_id: partner_id,server_token: server_token}}, function(err,res,body){
				data = JSON.parse(body);
				var statusNumber = convertStatusName(data.status);
				
				console.log(item);
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
					else if(statusNumber == 4)
					{
						sendMessage(item.api_url, 'Клиент на борту.', item.chat_id, token);
					}
					else if(statusNumber == 5)
					{
						sendMessage(item.api_url, 'Машина на месте', item.chat_id, token);
					}
					else if(statusNumber == 6)
					{
						sendMessage(item.api_url, 'Заказ отменен.', item.chat_id, token);
					}
					else if(statusNumber == 7)
					{
						sendMessage(item.api_url, 'Ожидание, водитель на месте.', item.chat_id, token);
					}
					else if(statusNumber == 8)
					{
						sendMessage(item.api_url, 'Водитель поедет в вам, как только закончит текущий заказ.', item.chat_id, token);
					}
					
				}
				console.log('dasdsadsadas',statusNumber);
				if(statusNumber == 6 || statusNumber == 2 || statusNumber == 3) {
					Status.remove({ chat_id: item.chat_id, order_id: item.order_id }, function (err) {
						if (err)
							throw err
						cb();
					});
				}
				else {
					item.status = statusNumber;
					Status.update({chat_id: item.chat_id}, item, null, function() {
						cb();		
					});
				}

				
			});
		}, function done() {
			//callback do nothing.
		});
	});
}