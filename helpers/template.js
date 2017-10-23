exports.instructions = function()
{
	return 'Я могу заказать вам такси. Отправьте слово \"Старт\" чтобы начать.';
}

exports.askAdress = function()
{
	return 'Здравствуйте! Я помогу вам вызвать такси. Откуда поедем?\nНапишите, пожалуйста, адрес отправления.';
}

exports.askFare = function(data)
{
	var numbers = ['1⃣', '2⃣', '3⃣', '4⃣', '5⃣', '6⃣', '7⃣', '8⃣', '9⃣'];
	let message = 'Выберите тариф:\n';
	for(let key in data)
	{
		message += numbers[key] + data[key].name + ' Посадка:' + data[key].flagfall + ' сом, Цена за 1 км:' + data[key].cost_per_kilometer + 'сом.\n';
	}
	return message;
}


exports.askPhoneNumber = function()
{
	return 'Напишите Ваш номер телефона в формате 0557хххххх или 996557хххххх';
}

exports.summary = function(object,phone_number)
{
	let result = 'Откуда:' + object.address + '\n';
	result += 'Тариф:' + object.fare + '\n';
	result += 'Телефон:' + phone_number + '\n';
	result += 'Отправьте \"Да\" чтобы оформить заказ, \"Нет\" чтобы отменить заказ.';
	return result;
}

exports.notPhoneNumber = function()
{
	return 'Напишите Ваш номер телефона в формате 0557хххххх или 996557хххххх';
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
