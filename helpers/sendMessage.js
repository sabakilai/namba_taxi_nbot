var request = require('request');

module.exports = function(url, content, chat_id, token, callback)
{
	var url = url + 'chats/' + chat_id + '/write';
	var postData = {
		'type': 'text/plain',
		'content': content
	}
	var options = {
		url: url,
		method: 'POST',
		headers: {
			'X-Namba-Auth-Token': token
		},
		body: postData,
		json: true
	}
	request(options,callback);
	console.log("Message content:" + content);
}