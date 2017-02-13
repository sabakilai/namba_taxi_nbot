exports.isPhoneNumber = function(value)
{
	counter = 0;
	for(let key in value)
	{
		if(!isNaN(value[key]))
		{
			counter ++;
		}
	}
	/* if non number exists in number*/
	if(value.length != counter)
		return false;
	if(counter == 10 && value.substr(0, 1) == '0') {
		value = value.replace("0", "996");
	}

	if(value.substr(0, 3) != '996')
		return false;
	counter = 0;
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
