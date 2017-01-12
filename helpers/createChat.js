var request = require('request');

module.exports = function(url, user_id, chat_name, token, img_token, callback)
{
	var postData = {
		'name': chat_name,
		'image': img_token,
		'members': [user_id]
	}
	var options = {
		url: url + 'chats/create',
		method: 'POST',
		headers: {
			'X-Namba-Auth-Token': token
		},
		body: postData,
		json: true
	}
	
	request(options,callback);
	console.log(chat_name + ' chat created');
}