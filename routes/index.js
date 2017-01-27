var express = require('express');
var router = express.Router();
var jsonfile = require('jsonfile');

// Bot settings
var chat_name = 'Намба Такси';
var token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MTIxLCJwaG9uZSI6IjA1NTk5NzYwMDAiLCJwYXNzd29yZCI6IjMxMDU3ZjUyMTU4MDkxMGI2ZWY3MjVjZmU1NzU4NGMyIiwiaXNCb3QiOnRydWUsImNvdW50cnkiOnRydWUsImlhdCI6MTQ4NTMzMDY4M30.d7GPBHrS6dY5OzYEf4skDaAfMasIAO4SfkEP4RS9fw8';
var img_token = '';

/* Models */
var Chat = require('../models/chat');
var Status = require('../models/status');

// Local
var sendMessage = require('../helpers/sendMessage');
var createChat = require('../helpers/createChat'); 
var template = require('../helpers/template');
var method = require('../helpers/TaxiApiParser');
var validate = require('../helpers/validate');
var findKeyWords = require('../helpers/findKeyWords');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET home page. */
router.post('/', function(req, res, next) {
  var currDate = Date.now();
	// define api_url
	var ip = req.connection.remoteAddress;
	if(ip == '::ffff:77.235.20.133') {
		var api_url = 'http://77.235.20.133:3000/';		
	}
	else {
		var api_url = 'https://api.namba1.co/'
	}
	// define event
	var event_name = req.body.event;

	if(event_name == 'user/follow') {
		let user_id = req.body.data.id;
		createChat(api_url, user_id, chat_name, token, img_token, function(error, response, body) {
			let chat_id = body.data.membership.chat_id;
			sendMessage(api_url, template.instructions(), chat_id, token, function() {
				res.end();
			});
		});
	}
	
	else if(event_name == 'user/unfollow') {
		let user_id = req.body.data.id;
		Chat.remove({ chat_id: chat_id, api_url: api_url }, function (err) {
			if (err) {
				throw err;
			}
			res.end();
		});
	}

	else if(event_name == 'message/new')
	{
		var content = req.body.data.content;
		let chat_id = req.body.data.chat_id;
		var addInstance = false;

		if(content.length > 20) {
			sendMessage(api_url, 'Не верный формат данных, пожалуйста введите текст.', chat_id, token, function() {
				res.end();
			});	
		}

		else {
			condition = {
				chat_id: chat_id ,
				api_url: api_url
			}

			Chat.findOne(condition, function(err, chat) {
				console.log(chat);
				if(!chat) {
					var instance = Chat({
						chat_id: chat_id ,
						api_url: api_url ,
						state: 0
					});
					addInstance = true;
				}
				else {
					var instance = chat;
				}
				//if(addInstance) {		
					instance.save(function(err) {		
						if(instance.state == 0) {
							let keyWords = ['start','старт'];
							if(findKeyWords(keyWords, content)) {
								sendMessage(api_url, template.askAdress(), chat_id, token, function() {
									instance.state = 1;
									Chat.update(condition, instance, null, function() {
										res.end();
									});
								});
							}
							else {
								sendMessage(api_url, template.instructions(), chat_id, token, function() {
									res.end();
								});
							}
						}
						else if(instance.state == 1) {
							jsonfile.readFile(__dirname + '/../faresData.json', function(err, faresData) {
								sendMessage(api_url, template.askFare(faresData), chat_id, token, function() {
									instance.state = 2;
									instance.address = content;
									Chat.update(condition, instance, null, function() {
										res.end();
									});
								});
							});
						}
						else if(instance.state == 2) {	
							jsonfile.readFile(__dirname + '/../faresData.json', function(err, faresData) {
								if(validate.isFare(content, faresData))
								{
									sendMessage(api_url, template.askPhoneNumber(), chat_id, token, function() {
										if(isNaN(content)) {
											instance.state = 3;
											instance.fare = content;
											Chat.update(condition, instance, null, function() {
												res.end();
											});
										}
										else {
											instance.state = 3;
											instance.fare = faresData[content - 1].name;
											Chat.update(condition, instance, null, function() {
												res.end();
											});
										}
									});
								}
								else
								{
									sendMessage(api_url, template.notFare(faresData), chat_id, token, function() {
										res.end();
									});
								}
							});
						}
						else if(instance.state == 3) {
							if(validate.isPhoneNumber(content))
							{
								instance.state = 4;
								instance.phone_number = content;
								Chat.update(condition, instance, null, function() {
									sendMessage(api_url, template.summary(instance,content), chat_id, token, function() {
										res.end();
									});
								});
								
							}
							else
							{
								sendMessage(api_url, template.notPhoneNumber(), chat_id, token, function() {
									res.end();
								});
							}
						}
						else if(instance.state == 4) {
							let keyWords = ['да','заказать','все верно'];
							if(findKeyWords(keyWords, content))
							{	
								jsonfile.readFile(__dirname + '/../faresData.json', function(err, faresData) {
									let phone_number = instance.phone_number;
									let address = instance.address;
									let fare = method.getFareId(instance.fare,faresData);
									console.log(fare);
									
									method.order(phone_number,address,fare, function(result) {
										console.log(result);
										if(typeof result.order_id != 'undefined')
										{	
											Status.findOne({chat_id: chat_id}, function(err, chat) {
												if(!chat) {
													sendMessage(api_url, 'Ваш заказ принят, возможен звонок оператора!\nНомер заказа:' + result.order_id, chat_id, token, function() {
														instance.state = 0;
														var statusInstance = Status({
															chat_id: chat_id,
															api_url: api_url,
															order_id: result.order_id,
															status: 0
														});
														statusInstance.save(function(err) {
															Chat.save(condition, instance, null, function() {
																res.end();
															});
														});
													});
												}
												else {
													sendMessage(api_url, 'Вы не можете заказать 2 такси одновременно.', chat_id, token, function(){
														instance.state = 0;
														Chat.update(condition, instance, null, function() {
															res.end();
														}); 
													});
												}
											});
										}
										else
										{
											sendMessage(api_url,'Ошибка сервера.', chat_id, token, function() {
												instance.state = 0;
												Chat.update(condition, instance, null, function() {
													res.end();
												}); 
											});
										}
									});
								});
							}
							else
							{
								sendMessage(api_url,'Заказ отменен.', chat_id, token, function() {
									instance.state = 0;
									Chat.update(condition, instance, null, function() {
										res.end();
									}); 
								});
							}
						}
					});
				/*}
				else {
					res.end();
				}*/
			});
		}
			
	}
});

module.exports = router;
