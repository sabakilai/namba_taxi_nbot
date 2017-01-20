var express = require('express');
var router = express.Router();

// Bot settings
var chat_name = 'Бот повар';
var token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6NDIwLCJwaG9uZSI6IjA1NTc5OTYwMTUiLCJwYXNzd29yZCI6IiQyYSQxMCROeUhqYVhpUGs5U0lTTWVIVldhT20uN1UvcGVwNXV3d0FDZ2kyQ0E4UmhBVHVKUllWRzJrVyIsImlzQm90Ijp0cnVlLCJjb3VudHJ5Ijp0cnVlLCJpYXQiOjE0ODQzMDA0Nzh9.QcJPmXA-HNwIH9Vr7K56fcagKe8oubeWQS8S62o6Yog';
var img_token = '';

// Local
var sendMessage = require('../helpers/sendMessage');
var createChat = require('../helpers/createChat'); 
var Chat = require('../models/chat');
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
			sendMessage(api_url, template.wellcome(), chat_id, token, function() {
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
					var instance = {
						chat_id: chat_id ,
						api_url: api_url ,
						state: 0
					}
					addInstance = true;
				}
				else {
					var instance = chat;
				}
				if(addInstance) {		
					axilary.save(function(err) {		
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
							method.fare(function(fare) {
								sendMessage(api_url, template.askFare(fare), chat_id, token, function() {
									instance.state = 2;
									instance.address = content;
									Chat.update(condition, instance, null, function() {
										res.end();
									});
								});
							})
						}
						else if(instance.state == 2) {	
							method.fare(function(fare) {
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
											instance.fare = fare[content - 1].name;
											Chat.update(condition, instance, null, function() {
												res.end();
											});
										}
									});
								}
								else
								{
									sendMessage(api_url, template.notFare(fare), chat_id, token, function() {
										var rendered = true;
										res.end();
									});
								}
							});
						}
					});
				}
			});
		}
			
	}
});

module.exports = router;
