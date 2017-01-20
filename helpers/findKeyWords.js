//Search array of keywords in text and return true if find one of them
module.exports = function(array, text)
{
	text = text.toLowerCase();
	for(key in array)
	{
		var index = text.indexOf(array[key]);
		if(index > -1)
		{
			return true;
		}
	}
	return false;
}