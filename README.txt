

   /**
    * ��� ����������� ������� ��������
    **/

User:
const UserSchema = new Schema({
    password: String, //����� �� ��������, �� ���������� � �� �����, �� ������ ���� � ���
    name: String,
    phone: String,
    email: String,
    addresses: [String], // ������ ���������
    verification: Boolean, //������ ������������� �� ����
    dateOfCreation: String,
    date: String, //�� ������ ��� ������ �������
    lastLogin: String,
    permissions: Number //����� ������������
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
    verification: Boolean, // �������� �������/������� ��� ���
    date: String
});


   /**
    * ����� � �����������
    **/

1.1) send req to /auth/register
    type: post,
	data: json from form,
	res: {status}

	/**
     * status: 201 - ������� (�������� ���� ��� �������� ����)
     *       , 400 - ��������� (��� ���������� ����� ������������)
     *       , 500 - Internal Server Error
     *       , 403 - ������ ������ 3� ����� � �����
     **/


1.2) send req /auth/checkHash (if res === 201)
    type: get,
	data: string (hash),
	res: {status, person}

		/**
         * status: 200 - ��� ��
         *       , 400 - ������������ ���
         *       , 500 - Internal Server Error,
         * person: obj User
         **/


1.3) send req /auth/resendMail
    type: post,
	res: {status}

		/**
         * status: 200 - ��� ��
         *       , 400 - ���������� ����� � �������
         *       , 500 - Internal Server Error
         **/


1.4) send req to /auth/login
    type: get,
	data: {login, password},
	res: {status, person}

		/**
         * status: 200 - ��� ��
         *       , 400 - ������������ ������
         *       , 500 - Internal Server Error;
         * person: obj User
         **/

   /**
    * ��������, ������������� �� ������������
    **/

1.4.1) send req to /auth/isLogin
    type: get,
	res: {status, person}

        /**
         * status: 200 - ��� ��
         *       , 400 - ������������ ������
         *       , 500 - Internal Server Error;
         * person: obj User
         **/

   /**
    * ����� �� ��������
    **/

1.5) send req to /auth/exit
    type: delete,
	res: {status}

        /**
         * status: 200 - ��� ��
         *       , 500 - Internal Server Error;
         **/


   /**
    * ������ �������
    **/


2.1) send req to /privateOffice/changeSettings (��������� �������� ��������)
    type: put,
	data: { updates:{
		        name,
		        phone,
		        addresses
	      }},
	res: {status}

        /**
         * status: 200 - ��� ��
         *       , 400 - ������� � �������!
         *       , 500 - Internal Server Error
         **/


        /**
        * ����� ������ � �������������� ����� email
        **/

2.2) send req to /privateOffice/changePassSendMail // �������� �� ���� ���� ��� ����� ������
    type: post,
	data: password, // ����� ������
	res: {status}

        /**
         * status: 200 - ��� ��
         *       , 400 - ������� � �������!
         *       , 500 - Internal Server Error
         **/

2.2.1) send req to /privateOffice/checkHash (�������� ����, ��� � � ������ � �����)
    type: post,
	data: hash,
	res: {status}

        /**
         * status: 200 - ��� ��
         *       , 400 - ������������ ���
         *       , 500 - Internal Server Error
         **/


   /**
    * ����������� � ws
    **/

2.3) connected to /privateOffice/ordersNow
	onMessage: return 'connected',
	return every update: order

   /**
    * ��������� ���������� ������� �� �������
    * default: �� �������
    * ����� ��� ������ �� ���������� ������
    * params: date + ���� ������� order, ����� phone, details � vin-������
    * ���� ���-�� �� �������, �� ���������� �� ��������� null
    **/


2.4) send req to /privateOffice/getFreeOrders
    type: get,
	data: {params},
	res: {status, {orders}}

        /**
         * status: 200 - �������
         *       , 404 - ��� �����
         * orders - ������ �������� order
         **/

   /**
    * �������� �������
    **/

2.5) send req to /privateOffice/acceptOrder
    type: post,
	data: {email, {order}},
	res: {status}

        /**
         * status: 201 - ������� (����� ������)
         *       , 404 - ����� ��� �������
         *       , 403 - ��� �������
         *       , 500 - Internal Server Error
         **/

   /**
    * ��������� ���� � �������� �������
    * default: ��� �������� �������� ������ ������������� �� ������� �����
    * ��� ��������� �������� �����:
    * let Time = new Date()
    * let date = `${Time.getDate()} ${Time.getMonth()} ${Time.getFullYear()}`
    * ��� ������ �� ���� ������ ������ ����� ���������, ����� ����� �� �����������
    **/

2.6) send req to /privateOffice/showAcceptOrdersByDate
    type: get,
	data: {email, date},
	res: {status, orders}

        /**
         * status: 200 - ��� �� (����� ����� � ����� � ��������� �� ������� �������)
         *       , 404 - ����� ��� �������
         *       , 500 - Internal Server Error;
         * orders - ������ �������� order �� ����
         **/

2.3.1) 

   /**
    * ������
    **/

3) send req to reqOfOrders/add (����������)
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
         * status: 201 - �������
         *       , 403 - ������ ������ 10� �������� � �����
         *       , 500 - Internal Server Error
         **/

   /**
    * Admin-panel
    **/

        /**
         * ������ ��������� ���������
         * default: ��� �������� �������� ������ ������������� �� N-� �����
         * ��� ��������� �������� �����:
         * let Time = new Date()
         * let date = `${Time.getDate()} ${Time.getMonth()} ${Time.getFullYear()}`
         * ��� ������ �� ���� ������ ������ ����� ���������, ����� ����� �� �����������
         * Persons - ������ � ��������� ���������. ������ ���� �������� ���������� ( ���� User.count ) � ��� ������ ���� + ������: �������, �������� �������
         **/

        /**
         * �� ����
         **/

4.1.1) send req admin/getUsersByDate
    type: get,
	data: date,
	res: {status, persons} ()

        /**
         * status: 302 - �������
         *       , 404 - �� �������
         *       , 403 - ��� �������
         *       , 400 - ����� ����� � �������;
         * Persons: {User} // ������ � ��������������
         **/

        /**
         * �� �����
         **/

4.1.2) send req admin/getUsersByEmail
    type: get,
	data: email,
	res: {status, persons} ()

        /**
         * status: 302 - �������
         *       , 404 - �� �������
         *       , 403 - ��� �������
         *       , 400 - ����� ����� � �������;
         * Persons: {User} // ������ � ��������������
         **/

        /**
         * �� ��������
         **/

4.1.3) send req admin/getUsersByPhone
    type: get,
	data: phone,
	res: {status, persons}

        /**
         * status: 302 - �������
         *       , 404 - �� �������
         *       , 403 - ��� �������
         *       , 400 - ����� ����� � �������;
         * Persons: {User} // ������ � ��������������
         **/

    /**
     * ��������� ��������
     **/

4.2) send req admin/changAccount
    type: put,
	data: {email, updates},
	res: {status}

        /**
         * status: 200 - �������
         *       , 500 - Internal Server Error
         *       , 403 - ��� �������
         *       , 400 - ����� ����� � �������
         **/


    /**
     * �������� ��������
     **/

4.3) send req admin/removeAccount
    type: delete,
	data: email,
	res: {status}

        /**
         * status: 200 - �������
         *       , 500 - Internal Server Error
         *       , 403 - ��� �������
         *       , 400 - ����� ����� � �������
         **/


    /**
     * �������� ����� ������� �� ����
     **/

4.4) send req admin/getOrdersByDate
	data: email,
	res: {status, orders}

        /**
         * status: 302 - �������
         *       , 404 - �� �������
         *       , 403 - ��� �������
         *       , 400 - ����� ����� � �������;
         * orders: {order} - ������ � ���������
         **/

    /**
     * ������� �����
     **/

4.4) send req admin/accessOrder
	data: {order}, //��������� ������ �� ����� ������, ����� � ��� ����� ���������, �� ��� ��������������� ������, ������, �� ���� ����� ���� ����� ����
	res: {status}

        /**
         * status: 200 - �������
         *       , 500 - Internal Server Error
         *       , 403 - ��� �������
         *       , 400 - ����� ����� � �������;
         **/

    /**
     * ��������� �����
     **/

4.4) send req admin/removeOrder
	data: {order},
	res: {status}

        /**
         * status: 200 - �������
         *       , 500 - Internal Server Error
         *       , 403 - ��� �������
         *       , 400 - ����� ����� � �������;
         **/
		















