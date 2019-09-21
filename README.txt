

   /**
    * все необходимые форматы объектов
    **/

User:
const UserSchema = new Schema({
    password: String, //Нигде не выводить, не передовать и не юзать, он просто есть и все
    name: String,
    phone: String,
    email: String,
    addresses: [String], // адреса магазинов
    verification: Boolean, //статус подтверждения по мылу
    dateOfCreation: String,
    date: String, //до какого дня продлён аккаунт
    lastLogin: String,
    permissions: Number //права пользователя 5Y3XjiPcvyY2IxW222 - secret
});

Order:
const OrderSchema = new Schema({
    label: String,
    model: String,
    year: String,
    vin: String,
    details: String,
    city: String,
    phone: String,
    verification: Boolean, // Одобрено админом/модером или нет
    date: String
});


   /**
    * Логин и регистрация
    **/

1.1) send req to /auth/register
    type: post,
	data: json from form,
	res: {status}

	/**
     * status: 201 - создано (показать окно для введения хеша)
     *       , 400 - отклонено (уже существует такой пользователь)
     *       , 500 - Internal Server Error
     *       , 403 - нельзя больше 3х акков в сутки
     **/


1.2) send req /auth/checkHash (if res === 201)
    type: get,
	data: string (hash),
	res: {status, person}

		/**
         * status: 200 - Все ок
         *       , 400 - Неправильный код
         *       , 500 - Internal Server Error,
         * person: obj User
         **/


1.3) send req /auth/resendMail
    type: post,
	res: {status}

		/**
         * status: 200 - Все ок
         *       , 400 - Необходимо войти в аккаунт
         *       , 500 - Internal Server Error
         **/


1.4) send req to /auth/login
    type: get,
	data: {login, password},
	res: {status, person}

		/**
         * status: 200 - Все ок
         *       , 400 - Неправильный пароль
         *       , 500 - Internal Server Error;
         * person: obj User
         **/

   /**
    * Проверка, авторизирован ли пользователь
    **/

1.4.1) send req to /auth/isLogin
    type: get,
	res: {status, person}

        /**
         * status: 200 - Все ок
         *       , 400 - Неправильный пароль
         *       , 500 - Internal Server Error;
         * person: obj User
         **/

   /**
    * Выход из аккаунта
    **/

1.5) send req to /auth/exit
    type: delete,
	res: {status}

        /**
         * status: 200 - Все ок
         *       , 500 - Internal Server Error;
         **/


   /**
    * Личный кабинет
    **/


2.1) send req to /privateOffice/changeSettings (Изменение настроек аккаунта)
    type: put,
	data: { updates:{
		        name,
		        phone,
		        addresses
	      }},
	res: {status}

        /**
         * status: 200 - Все ок
         *       , 400 - Войдите в аккаунт!
         *       , 500 - Internal Server Error
         **/


        /**
        * Смена пароля с подтверждением через email
        **/

2.2) send req to /privateOffice/changePassSendMail // Отправка на мыло хеша для смены пароля
    type: post,
	data: password, // новый пароль
	res: {status}

        /**
         * status: 200 - Все ок
         *       , 400 - Войдите в аккаунт!
         *       , 500 - Internal Server Error
         **/

2.2.1) send req to /privateOffice/checkHash (Проверка хеша, как и в случае с регой)
    type: post,
	data: hash,
	res: {status}

        /**
         * status: 200 - Все ок
         *       , 400 - Неправильный код
         *       , 500 - Internal Server Error
         **/


   /**
    * Подключение к ws
    **/

2.3) connected to /privateOffice/ordersNow
	onMessage: return 'connected',
	return every update: order

   /**
    * Подгрузка непринятых заказов по запросу
    * default: за сегодня
    * Потом уже исходя из параметров поиска
    * params: date + поля объекта order, кроме phone, details и vin-номера
    * Если что-то не введено, то отправлять со значением null
    **/


2.4) send req to /privateOffice/getFreeOrders
    type: get,
	data: {params},
	res: {status, {orders}}

        /**
         * status: 200 - Найдено
         *       , 404 - Нет таких
         * orders - объект объектов order
         **/

   /**
    * Принятие заказов
    **/

2.5) send req to /privateOffice/acceptOrder
    type: post,
	data: {email, {order}},
	res: {status}

        /**
         * status: 201 - Создано (Заказ принят)
         *       , 404 - Заказ уже приняли
         *       , 403 - Нет доступа
         *       , 500 - Internal Server Error
         **/

   /**
    * Получение инфы о принятых заказах
    * default: При загрузке выдавать список пользователей за текущее число
    * Код получения текущего числа:
    * let Time = new Date()
    * let date = `${Time.getDate()} ${Time.getMonth()} ${Time.getFullYear()}`
    * Для поиска от лица админа сделай через календарь, чтобы никто не нарукожопил
    **/

2.6) send req to /privateOffice/showAcceptOrdersByDate
    type: get,
	data: {email, date},
	res: {status, orders}

        /**
         * status: 200 - Все ок (Пушим заказ в сетку с принятыми на стороне клиента)
         *       , 404 - Заказ уже приняли
         *       , 500 - Internal Server Error;
         * orders - объект объектов order за дату
         **/

2.3.1) 

   /**
    * Заказы
    **/

3) send req to reqOfOrders/add (добавление)
    type: post,
	data: {
		label,
    	model,
   		year,
    	vin,
    	details,
    	city,
    	phone
	},
	res: {status}

        /**
         * status: 201 - Создано
         *       , 403 - Нельзя больше 10и запросов в сутки
         *       , 500 - Internal Server Error
         **/

   /**
    * Admin-panel
    **/

        /**
         * Выдача аккаунтов мазазинов
         * default: При загрузке выдавать список пользователей за N-е число
         * Код получения текущего числа:
         * let Time = new Date()
         * let date = `${Time.getDate()} ${Time.getMonth()} ${Time.getFullYear()}`
         * Для поиска от лица админа сделай через календарь, чтобы никто не нарукожопил
         * Persons - объект с объектами магазинов. Должна быть выведена статистика ( поле User.count ) и вся важная инфа + кнопки: удалить, изменить аккаунт
         **/

        /**
         * По дате
         **/

4.1.1) send req admin/getUsersByDate
    type: get,
	data: date,
	res: {status, persons} ()

        /**
         * status: 302 - Найдено
         *       , 404 - Не найдено
         *       , 403 - Нет доступа
         *       , 400 - Нужно войти в аккаунт;
         * Persons: {User} // Объект с пользователями
         **/

        /**
         * По почте
         **/

4.1.2) send req admin/getUsersByEmail
    type: get,
	data: email,
	res: {status, persons} ()

        /**
         * status: 302 - Найдено
         *       , 404 - Не найдено
         *       , 403 - Нет доступа
         *       , 400 - Нужно войти в аккаунт;
         * Persons: {User} // Объект с пользователями
         **/

        /**
         * По телефону
         **/

4.1.3) send req admin/getUsersByPhone
    type: get,
	data: phone,
	res: {status, persons}

        /**
         * status: 302 - Найдено
         *       , 404 - Не найдено
         *       , 403 - Нет доступа
         *       , 400 - Нужно войти в аккаунт;
         * Persons: {User} // Объект с пользователями
         **/

    /**
     * Изменение аккаунта
     **/

4.2) send req admin/changAccount
    type: put,
	data: {email, updates},
	res: {status}

        /**
         * status: 200 - Успешно
         *       , 500 - Internal Server Error
         *       , 403 - Нет доступа
         *       , 400 - Нужно войти в аккаунт
         **/


    /**
     * Удаление аккаунта
     **/

4.3) send req admin/removeAccount
    type: delete,
	data: email,
	res: {status}

        /**
         * status: 200 - Успешно
         *       , 500 - Internal Server Error
         *       , 403 - Нет доступа
         *       , 400 - Нужно войти в аккаунт
         **/


    /**
     * Получить ленту заказов по дате
     **/

4.4) send req admin/getOrdersByDate
	data: email,
	res: {status, orders}

        /**
         * status: 302 - Найдено
         *       , 404 - Не найдено
         *       , 403 - Нет доступа
         *       , 400 - Нужно войти в аккаунт;
         * orders: {order} - Объект с объектами
         **/

    /**
     * Принять заказ
     **/

4.4) send req admin/accessOrder
	data: {order}, //отправить объект со всеми полями, чтобы я его нашел нормально, тк нет индивидуального номера, точнее, по нему через жопу поиск идет
	res: {status}

        /**
         * status: 200 - Успешно
         *       , 500 - Internal Server Error
         *       , 403 - Нет доступа
         *       , 400 - Нужно войти в аккаунт;
         **/

    /**
     * Отклонить заказ
     **/

4.4) send req admin/removeOrder
	data: {order},
	res: {status}

        /**
         * status: 200 - Успешно
         *       , 500 - Internal Server Error
         *       , 403 - Нет доступа
         *       , 400 - Нужно войти в аккаунт;
         **/
		















