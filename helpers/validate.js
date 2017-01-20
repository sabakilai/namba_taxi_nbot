exports.isPhoneNumber = function(value)
{
	let counter = 0;
	let c = 0;
	for(let key in value)
	{
		if(!isNaN(value[key]))
		{
			counter ++;
		}
		else if(key != 0)
		{
			return false;
		}
	}
	if(counter >= 9)
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
