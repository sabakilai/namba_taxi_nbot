exports.instructions = function()
{
	return 'Я могу заказать вам такси. Отправьте слово \"Старт\" чтобы начать.';
}

exports.askAdress = function()
{
	return 'Откуда поедем?\n - напишите адрес отправления';
}

exports.askFare = function(data)
{
	let numbers = ['\uE21C','\uE21D','\uE21E','\uE21F','\uE220','\uE221','\uE222'];
	let message = '';
	for(let key in data)
	{

		message += numbers[key] + data[key].name + ' Посадка ' + data[key].flagfall + ',' + data[key].cost_per_kilometer + 'сом/км\n';
	}
	message += ' - Какой тариф предпочитаете?';
	return message;
}


exports.askPhoneNumber = function()
{
	return 'Ок, теперь отправьте свой номер телефона.';
}

exports.summary = function(object,phone_number)
{
	let result = 'Откуда:' + object.address + '\n';
	result += 'Тариф:' + object.fare + '\n';
	result += 'Тел:' + phone_number + '\n';
	result += 'Отправьте \"Да\" чтобы оформить заказ.\uE15A';
	return result;
}

exports.notPhoneNumber = function()
{
	return 'Неверный формат\uE413\n\"996557996009\"\n\uE00F Поробуй вот так.'
}

exports.notFare = function(data)
{
	message = 'Неверный формат\uE413\nВведите название тарифа или его номер.\n';
	let numbers = ['\uE21C','\uE21D','\uE21E','\uE21F','\uE220','\uE221','\uE222'];
	for(let key in data)
	{

		message += numbers[key] + data[key].name + ' Посадка ' + data[key].flagfall + ',' + data[key].cost_per_kilometer + 'сом/км\n';
	}
	return message;
}

exports.driverGetOrder = function(driver)
{
	var message = 'Водитель ' + driver.name + ' принял заказ и едет к вам,';
	message += 'на машине ' + driver.make + '\n';
	message += 'Номер водителя:' + driver.phone_number;
	return message;
}

exports.carOnPlace = function(driver)
{
	var message = 'Машина на месте';
	message += '(' + driver.make + ').\n';
	message += 'Номер водителя:' + driver.phone_number;
	return message;
}