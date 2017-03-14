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
	var numbers = ['1⃣', '2⃣', '3⃣', '4⃣', '5⃣', '6⃣', '7⃣', '8⃣', '9⃣'];
	let message = '';
	for(let key in data)
	{
		message += numbers[key] + data[key].name + ' Посадка:' + data[key].flagfall + ' сом, Цена за км:' + data[key].cost_per_kilometer + 'сом.\n';
	}
	message += ' - Какой тариф предпочитаете?';
	return message;
}


exports.askPhoneNumber = function()
{
	return 'Ок, теперь отправьте свой номер телефона в формате 0557XXXXXX или 996557XXXXXX';
}

exports.summary = function(object,phone_number)
{
	let result = 'Откуда:' + object.address + '\n';
	result += 'Тариф:' + object.fare + '\n';
	result += 'Тел:' + phone_number + '\n';
	result += 'Отправьте \"Да\" чтобы оформить заказ, \"Нет\" чтобы отменить заказ.';
	return result;
}

exports.notPhoneNumber = function()
{
	return 'Вы ввели неверный номер телефона, повторите ввод телефона в формате 0557XXXXXX или 996557XXXXXX';
}

exports.notFare = function(data)
{
	message = 'Неверный формат.\nВведите название тарифа или его номер.\n';
	var numbers = ['1⃣', '2⃣', '3⃣', '4⃣', '5⃣', '6⃣', '7⃣', '8⃣', '9⃣'];
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