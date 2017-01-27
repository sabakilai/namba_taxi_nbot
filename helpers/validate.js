exports.isPhoneNumber = function(value)
{
	if(value.substr(0, 3) != '996')
		return false;
	let counter = 0;
	for(let key in value)
	{
		if(!isNaN(value[key]))
		{
			counter ++;
		}
	}
	if(counter == 12)
	{
		return true;
	}
	return false;
}

exports.isFare = function(value, obj)
{
	value = value.toLowerCase();
	if(!isNaN(value) && value <= obj.length && value != '0')
	{
		return true;
	}
	else
	{
		for(let key in obj)
		{
			if(obj[key].name.toLowerCase() == value)
			{
				return true;
			}
		}
	}
	return false;
}
