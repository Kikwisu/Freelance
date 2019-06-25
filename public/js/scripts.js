window.onload = () => {

    var ws = new WebSocket('ws://localhost:8080');

    ws.onopen = function () {
        console.log('websocket is connected ...')}

    // event emmited when receiving message
    ws.onmessage = function (ev) {
        console.log(ev.data);
        document.getElementById('notification').innerHTML = `<i class="material-icons">notifications_active</i>`
        const sound = new Audio()
        sound.src =('sound.mp3');
        sound.play();
    }

    $(".button-collapse").sideNav();
    $('.modal').modal();
    $('.tabs').tabs();

    $('select').material_select();
    document.querySelectorAll('.select-wrapper').forEach(t => t.addEventListener('click', e=>e.stopPropagation()))

    $(".label").on('change', function() {
        let data = $(this).val()

        let obj = {label: data}

        $.ajax({

            url : '/getModels',
            type: "POST",
            data : obj,
            success : getModels

        });

    });

    function getModels(data) {

        let Models = data['models']
        let container = document.getElementById('model')
        container.disabled=false
        container.innerHTML = `<option disabled="disabled" selected="selected">Выберете модель</option>`

        for(let model of Models){
            let Models = `<option value="${model}">${model}</option>`
            container.innerHTML += Models
        }

        $('#model').prop("disabled", false);

        $('select').material_select();
        document.querySelectorAll('.select-wrapper').forEach(t => t.addEventListener('click', e=>e.stopPropagation()))
    }

    /*  Обработка форм */

    $( "#loginForm" ).submit(function (e) {
        e.preventDefault();

        if ($( this ).data( 'formstatus' ) !== ' submitting ' ){

            let form = $( this ),
                formUrl = form.attr( 'action' ),
                formMethod = form.attr( 'method' );

            let formData = form.serialize();

            $.ajax({

                url : formUrl,
                type : formMethod,
                data : formData,
                success : formSuccessAuth

            });
        }
        return false;
    })
    $( "#regForm" ).submit(function (e) {
        e.preventDefault();

        if ($( this ).data( 'formstatus' ) !== ' submitting ' ){

            let form = $( this ),
                formUrl = form.attr( 'action' ),
                formMethod = form.attr( 'method' );

            let formData = form.serialize();

            $.ajax({

                url : formUrl,
                type : formMethod,
                data : formData,
                success : formSuccessReg

            });
        }
        return false;
    })

    $( "#writeHashFormOne" ).submit(function (e) {
        e.preventDefault();

        if ($( this ).data( 'formstatus' ) !== ' submitting ' ){

            let form = $( this ),
                formUrl = form.attr( 'action' ),
                formMethod = form.attr( 'method' );

            let formData = form.serialize();

            $.ajax({

                url : formUrl,
                type : formMethod,
                data : formData,
                success : checkHashFormOneSuccessReg

            });
        }
        return false;
    })

    $( "#writeHashFormTwo" ).submit(function (e) {
        e.preventDefault();

        if ($( this ).data( 'formstatus' ) !== ' submitting ' ){

            let form = $( this ),
                formUrl = form.attr( 'action' ),
                formMethod = form.attr( 'method' );

            let formData = form.serialize();

            $.ajax({

                url : formUrl,
                type : formMethod,
                data : formData,
                success : checkHashForChangePass

            });
        }
        return false;
    })

    $( "#changePassSendMailFormOne" ).submit(function (e) {
        e.preventDefault();

        if ($( this ).data( 'formstatus' ) !== ' submitting ' ){

            let form = $( this ),
                formUrl = form.attr( 'action' ),
                formMethod = form.attr( 'method' );

            let formData = form.serialize();

            $.ajax({

                url : formUrl,
                type : formMethod,
                data : formData,
                success : sendHashForChangePass

            });
        }
        return false;
    })

    /* *
     * Отправка формы заказов
     * */

    $( "#reqOfOrdersAddForm" ).submit(function (e) {
        e.preventDefault();

        if ($( this ).data( 'formstatus' ) !== ' submitting ' ){

            let form = $( this ),
                formUrl = form.attr( 'action' ),
                formMethod = form.attr( 'method' );

            let formData = form.serialize();

            $.ajax({

                url : formUrl,
                type : formMethod,
                data : formData,
                success : ordersAddResult

            });
        }
        return false;
    })

    function ordersAddResult( data ) {
        let show = document.getElementById('showResultModal')
        let h5 = show.getElementsByTagName('h5')[0]

        if ( data.status === 201 )
            h5.innerHTML = "Вы успешно совершили заказ!"
        else if ( data.status === 500 )
            h5.innerHTML = "Упс, что-то пошло не так. Повторите попытку через пару часов"
        else if ( data.status === 501 )
            h5.innerHTML = "Все поля должны быть заполнены!"
        else if ( data.status === 403 )
            h5.innerHTML = "Нельзя больше 10и заказов в сутки!"


            $('#showResultModal').modal('open');
    }

    /* *
     * Выход из аккаунта
     * */

    $('#exit').click(() => {
        $.ajax({
            url : '/auth/exit',
            type: "POST",
            data : '',
            success : exit

        });
    })

    function exit( data ) {
        location.href = '/'
    }


    /* *
     * Навигация
     * */

    $('.privateOffice').click(() => {
        document.getElementById('notification').innerHTML = `<i class="material-icons">notifications</i>`
        $.ajax({
            url : '/getPrivateOffice',
            type: "POST",
            data : '',
            success : getPage

        });
    })
    $('#moderPanel').click(() => {
        $.ajax({
            url : '/getModerPanel',
            type: "POST",
            data : '',
            success : getPage

        });
    })

    $('#index').click(() => {
        $.ajax({
            url : '/getMain',
            type: "POST",
            data : '',
            success : getPage

        });
    })

    $('#adminPanel').click(() => {
        $.ajax({
            url : '/getAdminPanel',
            type: "POST",
            data : '',
            success : getPage

        });
    })

    $('#settings').click(() => {
        $.ajax({
            url : '/getSettings',
            type: "POST",
            data : '',
            success : getPage

        });
    })

    // Dynamic loading
    function getPage( data ) {
        ws.onmessage = function (ev) {
            console.log(ev.data);
            document.getElementById('notification').innerHTML = `<i class="material-icons">notifications_active</i>`
            const sound = new Audio()
            sound.src =('sound.mp3');
            sound.play();
        }
        let container = document.getElementsByTagName('main')[0];
        container.innerHTML = data
        $('.modal').modal();
        $('.tabs').tabs();
        $('ul.tabs').tabs();

        $('.datepicker').pickadate({
            selectMonths: true, // Creates a dropdown to control month
            selectYears: 15 // Creates a dropdown of 15 years to control year
        });

        $('select').material_select();
        document.querySelectorAll('.select-wrapper').forEach(t => t.addEventListener('click', e=>e.stopPropagation()))
        $('.datepicker').on('mousedown',function(event){
            event.preventDefault();
        })

        /* *
         * Connection to ws in private office
         * */
        /* *
         * Изменение данных аккаунта
         * */

        $( "#changeDataForm" ).submit(function (e) {
            e.preventDefault();

            if ($( this ).data( 'formstatus' ) !== ' submitting ' ){

                let form = $( this ),
                    formUrl = form.attr( 'action' ),
                    formMethod = form.attr( 'method' );

                let formData = form.serialize();

                $.ajax({

                    url : formUrl,
                    type : formMethod,
                    data : formData,
                    success : changeDataSuccess

                });
            }
            return false;
        })

        function changeDataSuccess( data ) {
            let show = document.getElementById('showResultModal')
            let h5 = show.getElementsByTagName('h5')[0]

            if ( data.status === 200 )
                h5.innerHTML = "Вы успешно изменили данные!"
            else if ( data.status === 500 )
                h5.innerHTML = "Упс, что-то пошло не так. Повторите попытку через пару часов"
            else if ( data.status === 400 )
                h5.innerHTML = "Сперва войдите в аккаунт!"


            $('#showResultModal').modal('open');
        }

        /* *
         * Отправка формы заказов
         * */

        $( "#reqOfOrdersAddForm" ).submit(function (e) {
            e.preventDefault();

            if ($( this ).data( 'formstatus' ) !== ' submitting ' ){

                let form = $( this ),
                    formUrl = form.attr( 'action' ),
                    formMethod = form.attr( 'method' );

                let formData = form.serialize();

                $.ajax({

                    url : formUrl,
                    type : formMethod,
                    data : formData,
                    success : ordersAddResult

                });
            }
            return false;
        })

        function ordersAddResult( data ) {
            let show = document.getElementById('showResultModal')
            let h5 = show.getElementsByTagName('h5')[0]

            if ( data.status === 201 )
                h5.innerHTML = "Вы успешно совершили заказ!"
            else if ( data.status === 500 )
                h5.innerHTML = "Упс, что-то пошло не так. Повторите попытку через пару часов"
            else if ( data.status === 403 )
                h5.innerHTML = "Нельзя больше 10и заказов в сутки!"


            $('#showResultModal').modal('open');
        }

        $( "#changePassSendMailFormTwo" ).submit(function (e) {
            e.preventDefault();

            if ($( this ).data( 'formstatus' ) !== ' submitting ' ){

                let form = $( this ),
                    formUrl = form.attr( 'action' ),
                    formMethod = form.attr( 'method' );

                let formData = form.serialize();

                $.ajax({

                    url : formUrl,
                    type : formMethod,
                    data : formData,
                    success : sendHashForChangePass

                });
            }
            return false;
        })

        function sendHashForChangePass( data ) {
            if ( data.status === 200 )
                $('#writeHashRegainPassModal').modal('open');
            else if ( data.status === 500 ){
                let show = document.getElementById('showResultModal')
                let li = show.getElementsByTagName('h5')[0]
                li.innerHTML = "Упс, что-то пошло не так. Повторите попытку через пару часов"
                $('#showResultModal').modal('open');
            }
        }

        /* *
         * Получение пользователей
         * */


        $( "#getUsersByQueryForm" ).submit(function (e) {
            e.preventDefault();

            if ($( this ).data( 'formstatus' ) !== ' submitting ' ){

                let form = $( this ),
                    formUrl = form.attr( 'action' ),
                    formMethod = form.attr( 'method' );

                let formData = form.serialize();

                $.ajax({

                    url : formUrl,
                    type : formMethod,
                    data : formData,
                    success : getUsersByQuerySuccess

                });
            }
            return false;
        })

        function getUsersByQuerySuccess( data ) {
            if ( data.status === 302 ){
                let container = document.getElementById('usersForAdmin')
                let i = 0
                for(let person of data.persons){
                    let countOfOrders = data.stats[person.email]
                    let htmlOfPersons = `<form method="POST" action="/admin/changAccount" class="usersOfAdmin">
                                    <div class="row">
                                        <div class="input-field col s12">
                                            <input class="validate valid" value="${person.name}" type="text" name="name">
                                        </div>
                                        <div class="input-field col s12">
                                            <input class="validate valid" value="${person.phone}" type="tel" name="phone">
                                        </div>
                                        <div class="input-field col s12">
                                            <input class="validate valid" value="${person.email}" type="email" name="email">
                                        </div>
                                        <div class="input-field col s12">
                                            <input id="verification${i}" class="validate valid" value="${person.verification}" type="text" name="verification">
                                            <label for="verification${i}">Подтверждение по почте: </label>
                                        </div>
                                        <div class="input-field col s12">
                                            <input id="dateOfCreation${i}" class="validate valid" value="${person.dateOfCreation}" type="text" name="dateOfCreation">
                                            <label for="dateOfCreation${i}">Дата создания: </label>
                                        </div>
                                        <div class="input-field col s12">
                                            <input id="date${i}" class="validate valid" value="${person.date}" type="text" name="date">
                                            <label for="date${i}">Продлен до: </label>
                                        </div>
                                        <div class="input-field col s12">
                                            <input id="lastLogin${i}" class="validate valid" value="${person.lastLogin}" type="text" name="lastLogin">
                                            <label for="lastLogin${i}">Время последнего входа в сеть: </label>
                                        </div>
                                        <div class="input-field col s12">
                                            <input id="permissions${i}" class="validate valid" value="${person.permissions}" type="text" name="permissions">
                                            <label for="permissions${i}">Права пользователя: (0 - магазин, 1 - модератор, 2 - админ)</label>
                                        </div>
                                        <div class="input-field col s12">
                                            <input id="countOfOrders${i}" class="validate valid" value="${countOfOrders}" type="text" name="countOfOrders">
                                            <label for="countOfOrders${i}">Принято заказов: </label>
                                        </div>
                                        <div class="input-field col s12">
                                            <input class="validate btn waves-effect black waves-light" value="Сохранить изменения" type="submit">
                                        </div>
                                    </div>
                                </form>
                                <form method="POST" action="/admin/removeAccount" class="AdminRemoveAccount">
                                    <div class="row">
                                        <div class="input-field col s12">
                                            <input class="validate valid" value="${person.email}" type="email" name="email" style="display: none">
                                        </div>
                                        <div class="input-field col s12">
                                            <input class="validate btn waves-effect red waves-light" value="Удалить аккаунт" type="submit">
                                        </div>
                                    </div>
                                </form>`
                    container.innerHTML += htmlOfPersons
                    let Inputs = container.getElementsByTagName('input')
                    for(let input of Inputs)
                        input.focus()
                    i++
                }
            }
            else if ( data.status === 500 ){
                let show = document.getElementById('showResultModal')
                let li = show.getElementsByTagName('h5')[0]
                li.innerHTML = "Упс, что-то пошло не так. Повторите попытку через пару часов"
                $('#showResultModal').modal('open');
            } else if( data.status === 400 ){
                let show = document.getElementById('showResultModal')
                let li = show.getElementsByTagName('h5')[0]
                li.innerHTML = "Сперва войдите в аккаунт!"
                $('#showResultModal').modal('open');
            } else if( data.status === 403 ){
                let show = document.getElementById('showResultModal')
                let li = show.getElementsByTagName('h5')[0]
                li.innerHTML = "Нет доступа"
                $('#showResultModal').modal('open');
            } else if( data.status === 404 ){
                let container = document.getElementById('usersForAdmin')
                container.innerHTML = "<h5> Пользователи не найдены </h5>"
            }

            $( ".usersOfAdmin" ).submit(function (e) {
                e.preventDefault();

                if ($( this ).data( 'formstatus' ) !== ' submitting ' ){
                    let form = $( this ),
                        formUrl = form.attr( 'action' ),
                        formMethod = form.attr( 'method' );

                    let formData = form.serialize();

                    $.ajax({

                        url : formUrl,
                        type : formMethod,
                        data : formData,
                        success : getUsersOfAdminSuccess

                    });
                }
                return false;
            })


            function getUsersOfAdminSuccess( data ) {
                let show = document.getElementById('showResultModal')
                let li = show.getElementsByTagName('h5')[0]

                if ( data.status === 400 )
                    li.innerHTML = "Войдите в аккаунт!"
                else if ( data.status === 500 )
                    li.innerHTML = "Упс, что-то пошло не так. Повторите попытку через пару часов"
                else if ( data.status === 200 ){
                    li.innerHTML = "Изменения сохранены"
                }
                else if ( data.status === 403 ){
                    li.innerHTML = "Нет доступа"
                }
                $('#showResultModal').modal('open');
            }

            $( ".AdminRemoveAccount" ).submit(function (e) {
                e.preventDefault();

                if ($( this ).data( 'formstatus' ) !== ' submitting ' ){
                    let form = $( this ),
                        formUrl = form.attr( 'action' ),
                        formMethod = form.attr( 'method' );

                    let formData = form.serialize();
                    $.ajax({

                        url : formUrl,
                        type : formMethod,
                        data : formData,
                        success : adminRemoveAccountSuccess

                    });
                }
                return false;
            })

            function adminRemoveAccountSuccess( data ) {
                let show = document.getElementById('showResultModal')
                let li = show.getElementsByTagName('h5')[0]

                if ( data.status === 400 )
                    li.innerHTML = "Войдите в аккаунт!"
                else if ( data.status === 500 )
                    li.innerHTML = "Упс, что-то пошло не так. Повторите попытку через пару часов"
                else if ( data.status === 200 ){
                    let container = document.getElementById('usersForAdmin')
                    container.innerHTML = ''
                    $( "#getUsersByQueryForm" ).submit()
                    li.innerHTML = "Аккаунт удалён"
                }
                else if ( data.status === 403 ){
                    li.innerHTML = "Нет доступа"
                }
                $('#showResultModal').modal('open');
            }


        }

        /* *
         * Получение статистика аккаунта
         * */

        $( "#getStatisticForm" ).submit(function (e) {
            e.preventDefault();

            if ($( this ).data( 'formstatus' ) !== ' submitting ' ){

                let form = $( this ),
                    formUrl = form.attr( 'action' ),
                    formMethod = form.attr( 'method' );

                let formData = form.serialize();

                $.ajax({

                    url : formUrl,
                    type : formMethod,
                    data : formData,
                    success : getStatisticSuccess

                });
            }
            return false;
        })

        function getStatisticSuccess (data) {
            let container = document.getElementById('stats')

            for (let order1 of data.stats) {
                let order = JSON.parse(order1)
                let htmlOfOrders = `
                                    <ul class="collection">
                                      <li class="collection-item">Марка: ${order.label}</li>
                                      <li class="collection-item">Модель: ${order.model}</li>
                                      <li class="collection-item">Год выпуска: ${order.year}</li>
                                      <li class="collection-item">VIN: ${order.vin}</li>
                                      <li class="collection-item">Детали: ${order.details}</li>
                                      <li class="collection-item">Город: ${order.city}</li>
                                      <li class="collection-item">Телефон: ${order.phone}</li>
                                    </ul>
                                `
                container.innerHTML += htmlOfOrders
            }
        }

        /* *
         * Получение заказов
         * */

        $( "#getOrdersByQueryPrivateForm" ).submit(function (e) {
            e.preventDefault();

            if ($( this ).data( 'formstatus' ) !== ' submitting ' ){

                let form = $( this ),
                    formUrl = form.attr( 'action' ),
                    formMethod = form.attr( 'method' );

                let formData = form.serialize();

                $.ajax({

                    url : formUrl,
                    type : formMethod,
                    data : formData,
                    success : getOrdersByQueryPrivateSuccess

                });
            }
            return false;
        })

        function getOrdersByQueryPrivateSuccess( data ) {
            if ( data.status === 302 ){
                let container = document.getElementById('ordersForAdmin')
                let i = 0
                for(let order of data.orders){
                    let htmlOfOrders = `<form method="POST" action="/privateOffice/acceptOrder" class="accessOrderByAccount">
                                    <div class="row">
                                        <div class="input-field col s12">
                                            <input class="validate valid" value="${order.label}" type="text" name="label" style="display: none">
                                        </div>
                                        <div class="input-field col s12">
                                            <input class="validate valid" value="${order.model}" type="text" name="model" style="display: none">
                                        </div>
                                        <div class="input-field col s12">
                                            <input class="validate valid" value="${order.year}" type="text" name="year" style="display: none">
                                        </div>
                                        <div class="input-field col s12">
                                            <input id="vin${i}" class="validate valid" value="${order.vin}" type="text" name="vin" style="display: none">
                                            
                                        </div>
                                        <div class="input-field col s12">
                                            <input id="details${i}" class="validate valid" value="${order.details}" type="text" name="details" style="display: none">
                                            
                                        </div>
                                        <div class="input-field col s12">
                                            <input id="city${i}" class="validate valid" value="${order.city}" type="text" name="city" style="display: none">
                                            
                                        </div>
                                        <div class="input-field col s12">
                                            <input class="validate valid" value="${order.phone}" type="tel" name="phone" style="display: none">
                                        </div>
                                        <div class="input-field col s12">
                                            <input class="validate valid" value="${order.time}" type="text" name="time" style="display: none">
                                        </div>
                                        <div class="input-field col s12">
                                            <ul class="collection">
                                              <li class="collection-item">Марка: ${order.label}</li>
                                              <li class="collection-item">Модель: ${order.model}</li>
                                              <li class="collection-item">Год выпуска: ${order.year}</li>
                                              <li class="collection-item">VIN: ${order.vin}</li>
                                              <li class="collection-item">Детали: ${order.details}</li>
                                              <li class="collection-item">Город: ${order.city}</li>
                                              <li class="collection-item">Телефон: ${order.phone}</li>
                                            </ul>
                                        </div>
                                        <div class="input-field col s12">
                                            <input class="validate btn waves-effect black waves-light" value="Принять заказ" type="submit">
                                        </div>
                                    </div>
                                </form>
                                `
                    container.innerHTML += htmlOfOrders
                    let Inputs = container.getElementsByTagName('input')
                    for(let input of Inputs)
                        input.focus()
                    i++
                }
            }
            else if ( data.status === 500 ){
                let show = document.getElementById('showResultModal')
                let li = show.getElementsByTagName('h5')[0]
                li.innerHTML = "Упс, что-то пошло не так. Повторите попытку через пару часов"
                $('#showResultModal').modal('open');
            } else if( data.status === 400 ){
                let show = document.getElementById('showResultModal')
                let li = show.getElementsByTagName('h5')[0]
                li.innerHTML = "Сперва войдите в аккаунт!"
                $('#showResultModal').modal('open');
            } else if( data.status === 403 ){
                let show = document.getElementById('showResultModal')
                let li = show.getElementsByTagName('h5')[0]
                li.innerHTML = "Нет доступа"
                $('#showResultModal').modal('open');
            } else if( data.status === 404 ){
                let container = document.getElementById('ordersForAdmin')
                container.innerHTML = "<h5> Заказы не найдены </h5>"
            }

            $( ".accessOrderByAccount" ).submit(function (e) {
                e.preventDefault();

                if ($( this ).data( 'formstatus' ) !== ' submitting ' ){
                    let form = $( this ),
                        formUrl = form.attr( 'action' ),
                        formMethod = form.attr( 'method' );

                    let formData = form.serialize();

                    $.ajax({

                        url : formUrl,
                        type : formMethod,
                        data : formData,
                        success : getaccessOrderByAccountSuccess

                    });
                }
                return false;
            })


            function getaccessOrderByAccountSuccess( data ) {
                let show = document.getElementById('showResultModal')
                let li = show.getElementsByTagName('h5')[0]

                if ( data.status === 400 )
                    li.innerHTML = "Войдите в аккаунт!"
                else if ( data.status === 500 )
                    li.innerHTML = "Упс, что-то пошло не так. Повторите попытку через пару часов"
                else if ( data.status === 201 ){
                    li.innerHTML = "Заказ принят"
                    let container = document.getElementById('ordersForAdmin')
                    container.innerHTML = ""
                    $( "#getOrdersByQueryPrivateForm" ).submit()
                }
                else if ( data.status === 403 ){
                    li.innerHTML = "Нет доступа"
                }
                $('#showResultModal').modal('open');
            }


        }

        $( "#getOrdersByQueryForm" ).submit(function (e) {
            e.preventDefault();

            if ($( this ).data( 'formstatus' ) !== ' submitting ' ){

                let form = $( this ),
                    formUrl = form.attr( 'action' ),
                    formMethod = form.attr( 'method' );

                let formData = form.serialize();

                $.ajax({

                    url : formUrl,
                    type : formMethod,
                    data : formData,
                    success : getOrdersByQuerySuccess

                });
            }
            return false;
        })

        function getOrdersByQuerySuccess( data ) {
            if ( data.status === 302 ){
                let container = document.getElementById('ordersForAdmin')
                let i = 0
                for(let order of data.orders){
                    let htmlOfOrders = `<form method="POST" action="/admin/accessOrder" class="accessOrderByAdmin">
                                    <div class="row">
                                        <div class="input-field col s12">
                                            <input class="validate valid" value="${order.label}" type="text" name="label">
                                        </div>
                                        <div class="input-field col s12">
                                            <input class="validate valid" value="${order.model}" type="text" name="model">
                                        </div>
                                        <div class="input-field col s12">
                                            <input class="validate valid" value="${order.year}" type="text" name="year">
                                        </div>
                                        <div class="input-field col s12">
                                            <input id="vin${i}" class="validate valid" value="${order.vin}" type="text" name="vin">
                                            <label for="vin${i}">Vin </label>
                                        </div>
                                        <div class="input-field col s12">
                                            <input id="details${i}" class="validate valid" value="${order.details}" type="text" name="details">
                                            <label for="details${i}">Детали: </label>
                                        </div>
                                        <div class="input-field col s12">
                                            <input id="city${i}" class="validate valid" value="${order.city}" type="text" name="city">
                                            <label for="city${i}">Город: </label>
                                        </div>
                                        <div class="input-field col s12">
                                            <input class="validate valid" value="${order.phone}" type="tel" name="phone">
                                        </div>
                                        <div class="input-field col s12">
                                            <input id="date${i}" class="validate valid" value="${order.date}" type="text" name="date">
                                            <label for="date${i}">Дата создания</label>
                                        </div>
                                        <div class="input-field col s12">
                                            <input class="validate valid" value="${order.time}" type="text" name="time">
                                        </div>
                                        <div class="input-field col s12">
                                            <input class="validate btn waves-effect black waves-light" value="Принять заказ" type="submit">
                                        </div>
                                    </div>
                                </form>
                                <form method="POST" action="/admin/removeOrder" class="AdminRemoveOrder" class="order">
                                    <div class="row">
                                        <div class="row">
                                        <div class="input-field col s12">
                                            <input class="validate valid" value="${order.label}" type="text" name="label" style="display: none">
                                        </div>
                                        <div class="input-field col s12">
                                            <input class="validate valid" value="${order.model}" type="text" name="model" style="display: none">
                                        </div>
                                        <div class="input-field col s12">
                                            <input class="validate valid" value="${order.year}" type="text" name="year" style="display: none">
                                        </div>
                                        <div class="input-field col s12">
                                            <input id="vin" class="validate valid" value="${order.vin}" type="text" name="vin" style="display: none">
                                        </div>
                                        <div class="input-field col s12">
                                            <input id="details" class="validate valid" value="${order.details}" type="text" name="details" style="display: none">
                                        </div>
                                        <div class="input-field col s12">
                                            <input id="city" class="validate valid" value="${order.city}" type="text" name="city" style="display: none">
                                        </div>
                                        <div class="input-field col s12">
                                            <input class="validate valid" value="${order.phone}" type="tel" name="phone" style="display: none">
                                        </div>
                                        <div class="input-field col s12">
                                            <input id="date" class="validate valid" value="${order.date}" type="text" name="date" style="display: none">
                                        </div>
                                        <div class="input-field col s12">
                                            <input id="date" class="validate valid" value="${order.time}" type="text" name="time" style="display: none">
                                        </div>
                                        <div class="input-field col s12">
                                            <input class="validate btn waves-effect red waves-light" value="Отклонить заказ" type="submit">
                                        </div>
                                    </div>
                                </form>`
                    container.innerHTML += htmlOfOrders
                    let Inputs = container.getElementsByTagName('input')
                    for(let input of Inputs)
                        input.focus()
                    i++
                }
            }
            else if ( data.status === 500 ){
                let show = document.getElementById('showResultModal')
                let li = show.getElementsByTagName('h5')[0]
                li.innerHTML = "Упс, что-то пошло не так. Повторите попытку через пару часов"
                $('#showResultModal').modal('open');
            } else if( data.status === 400 ){
                let show = document.getElementById('showResultModal')
                let li = show.getElementsByTagName('h5')[0]
                li.innerHTML = "Сперва войдите в аккаунт!"
                $('#showResultModal').modal('open');
            } else if( data.status === 403 ){
                let show = document.getElementById('showResultModal')
                let li = show.getElementsByTagName('h5')[0]
                li.innerHTML = "Нет доступа"
                $('#showResultModal').modal('open');
            } else if( data.status === 404 ){
                let container = document.getElementById('ordersForAdmin')
                container.innerHTML = "<h5> Заказы не найдены </h5>"
            }

            $( ".accessOrderByAdmin" ).submit(function (e) {
                e.preventDefault();

                if ($( this ).data( 'formstatus' ) !== ' submitting ' ){
                    let form = $( this ),
                        formUrl = form.attr( 'action' ),
                        formMethod = form.attr( 'method' );

                    let formData = form.serialize();

                    $.ajax({

                        url : formUrl,
                        type : formMethod,
                        data : formData,
                        success : getaccessOrderByAdminSuccess

                    });
                }
                return false;
            })


            function getaccessOrderByAdminSuccess( data ) {
                let show = document.getElementById('showResultModal')
                let li = show.getElementsByTagName('h5')[0]

                if ( data.status === 400 )
                    li.innerHTML = "Войдите в аккаунт!"
                else if ( data.status === 500 )
                    li.innerHTML = "Упс, что-то пошло не так. Повторите попытку через пару часов"
                else if ( data.status === 200 ){

                    //var ws = new WebSocket('ws://localhost:8080');

                    ws.send(JSON.stringify(data.order))

                    li.innerHTML = "Заказ принят"
                    let container = document.getElementById('ordersForAdmin')
                    container.innerHTML = ""
                    $( "#getOrdersByQueryForm" ).submit()
                }
                else if ( data.status === 403 ){
                    li.innerHTML = "Нет доступа"
                }
                $('#showResultModal').modal('open');
            }

            $( ".AdminRemoveOrder" ).submit(function (e) {
                e.preventDefault();

                if ($( this ).data( 'formstatus' ) !== ' submitting ' ){
                    let form = $( this ),
                        formUrl = form.attr( 'action' ),
                        formMethod = form.attr( 'method' );

                    let formData = form.serialize();
                    $.ajax({

                        url : formUrl,
                        type : formMethod,
                        data : formData,
                        success : adminRemoveOrderSuccess

                    });
                }
                return false;
            })

            function adminRemoveOrderSuccess( data ) {
                let show = document.getElementById('showResultModal')
                let li = show.getElementsByTagName('h5')[0]

                if ( data.status === 400 )
                    li.innerHTML = "Войдите в аккаунт!"
                else if ( data.status === 500 )
                    li.innerHTML = "Упс, что-то пошло не так. Повторите попытку через пару часов"
                else if ( data.status === 200 ){
                    li.innerHTML = "Заказ откланён"
                    let container = document.getElementById('ordersForAdmin')
                    container.innerHTML = ""
                    $( "#getOrdersByQueryForm" ).submit()
                }
                else if ( data.status === 403 ){
                    li.innerHTML = "Нет доступа"
                }
                $('#showResultModal').modal('open');
            }


        }

        /* *
         * Настройка формы заказов
         * */

        $( "#addCitiesForm" ).submit(function (e) {
            e.preventDefault();

            if ($( this ).data( 'formstatus' ) !== ' submitting ' ){
                let form = $( this ),
                    formUrl = form.attr( 'action' ),
                    formMethod = form.attr( 'method' );

                let formData = form.serialize();
                $.ajax({

                    url : formUrl,
                    type : formMethod,
                    data : formData,
                    success : addCitiesSuccess

                });
            }
            return false;
        })

        function addCitiesSuccess( data ) {
            let show = document.getElementById('showResultModal')
            let li = show.getElementsByTagName('h5')[0]

            if ( data.status === 400 )
                li.innerHTML = "Войдите в аккаунт!"
            else if ( data.status === 500 )
                li.innerHTML = "Упс, что-то пошло не так. Повторите попытку через пару часов"
            else if ( data.status === 200 ){
                li.innerHTML = "Город добавлен"
            }
            else if ( data.status === 403 ){
                li.innerHTML = "Нет доступа"
            }
            $('#showResultModal').modal('open');
        }

        $( "#removeCitiesForm" ).submit(function (e) {
            e.preventDefault();

            if ($( this ).data( 'formstatus' ) !== ' submitting ' ){
                let form = $( this ),
                    formUrl = form.attr( 'action' ),
                    formMethod = form.attr( 'method' );

                let formData = form.serialize();
                $.ajax({

                    url : formUrl,
                    type : formMethod,
                    data : formData,
                    success : removeCitiesSuccess

                });
            }
            return false;
        })

        function removeCitiesSuccess( data ) {
            let show = document.getElementById('showResultModal')
            let li = show.getElementsByTagName('h5')[0]

            if ( data.status === 400 )
                li.innerHTML = "Войдите в аккаунт!"
            else if ( data.status === 500 )
                li.innerHTML = "Упс, что-то пошло не так. Повторите попытку через пару часов"
            else if ( data.status === 200 ){
                li.innerHTML = "Город удалён"
            }
            else if ( data.status === 403 ){
                li.innerHTML = "Нет доступа"
            }
            $('#showResultModal').modal('open');
        }

        $( "#addLabelForm" ).submit(function (e) {
            e.preventDefault();

            if ($( this ).data( 'formstatus' ) !== ' submitting ' ){
                let form = $( this ),
                    formUrl = form.attr( 'action' ),
                    formMethod = form.attr( 'method' );

                let formData = form.serialize();
                $.ajax({

                    url : formUrl,
                    type : formMethod,
                    data : formData,
                    success : addLabelSuccess

                });
            }
            return false;
        })

        function addLabelSuccess( data ) {
            let show = document.getElementById('showResultModal')
            let li = show.getElementsByTagName('h5')[0]

            if ( data.status === 400 )
                li.innerHTML = "Войдите в аккаунт!"
            else if ( data.status === 500 )
                li.innerHTML = "Упс, что-то пошло не так. Повторите попытку через пару часов"
            else if ( data.status === 200 ){
                li.innerHTML = "Марка добавлена"
            }
            else if ( data.status === 403 ){
                li.innerHTML = "Нет доступа"
            }
            $('#showResultModal').modal('open');
        }

        $( "#removeLabelForm" ).submit(function (e) {
            e.preventDefault();

            if ($( this ).data( 'formstatus' ) !== ' submitting ' ){
                let form = $( this ),
                    formUrl = form.attr( 'action' ),
                    formMethod = form.attr( 'method' );

                let formData = form.serialize();
                $.ajax({

                    url : formUrl,
                    type : formMethod,
                    data : formData,
                    success : removeLabelSuccess

                });
            }
            return false;
        })

        function removeLabelSuccess( data ) {
            let show = document.getElementById('showResultModal')
            let li = show.getElementsByTagName('h5')[0]

            if ( data.status === 400 )
                li.innerHTML = "Войдите в аккаунт!"
            else if ( data.status === 500 )
                li.innerHTML = "Упс, что-то пошло не так. Повторите попытку через пару часов"
            else if ( data.status === 200 ){
                li.innerHTML = "Марка удалёна"
            }
            else if ( data.status === 403 ){
                li.innerHTML = "Нет доступа"
            }
            $('#showResultModal').modal('open');
        }

        $( "#addModelForm" ).submit(function (e) {
            e.preventDefault();

            if ($( this ).data( 'formstatus' ) !== ' submitting ' ){
                let form = $( this ),
                    formUrl = form.attr( 'action' ),
                    formMethod = form.attr( 'method' );

                let formData = form.serialize();
                $.ajax({

                    url : formUrl,
                    type : formMethod,
                    data : formData,
                    success : addModelSuccess

                });
            }
            return false;
                })

        function addModelSuccess( data ) {
            let show = document.getElementById('showResultModal')
            let li = show.getElementsByTagName('h5')[0]

            if ( data.status === 400 )
                li.innerHTML = "Войдите в аккаунт!"
            else if ( data.status === 500 )
                li.innerHTML = "Упс, что-то пошло не так. Повторите попытку через пару часов"
            else if ( data.status === 200 ){
                li.innerHTML = "Модель добавлена"
            }
            else if ( data.status === 403 ){
                li.innerHTML = "Нет доступа"
            }
            $('#showResultModal').modal('open');
        }

        $( "#removeModelForm" ).submit(function (e) {
            e.preventDefault();

            if ($( this ).data( 'formstatus' ) !== ' submitting ' ){
                let form = $( this ),
                    formUrl = form.attr( 'action' ),
                    formMethod = form.attr( 'method' );

                let formData = form.serialize();
                $.ajax({

                    url : formUrl,
                    type : formMethod,
                    data : formData,
                    success : removeModelSuccess

                });
            }
            return false;
        })

        function removeModelSuccess( data ) {
            let show = document.getElementById('showResultModal')
            let li = show.getElementsByTagName('h5')[0]

            if ( data.status === 400 )
                li.innerHTML = "Войдите в аккаунт!"
            else if ( data.status === 500 )
                li.innerHTML = "Упс, что-то пошло не так. Повторите попытку через пару часов"
            else if ( data.status === 200 ){
                li.innerHTML = "Марка удалёна"
            }
            else if ( data.status === 403 ){
                li.innerHTML = "Нет доступа"
            }
            $('#showResultModal').modal('open');
        }

        //Изменения моделей по марке

        $(".label").on('change', function() {
            let data = $(this).val()

            let obj = {label: data}

            $.ajax({

                url : '/getModels',
                type: "POST",
                data : obj,
                success : getModels

            });

        });

        function getModels(data) {

            let Models = data['models']
            let container = document.getElementById('model')
            container.disabled=false
            container.innerHTML = `<option disabled="disabled" selected="selected">Выберете модель</option>`

            for(let model of Models){
                let Models = `<option value="${model}">${model}</option>`
                container.innerHTML += Models
            }

            $('#model').prop("disabled", false);

            $('select').material_select();
            document.querySelectorAll('.select-wrapper').forEach(t => t.addEventListener('click', e=>e.stopPropagation()))
        }

    }
}

function formSuccessAuth( data ) {
    let show = document.getElementById('showResultModal')
    let li = show.getElementsByTagName('h5')[0]

    if ( data.status === 400 )
        li.innerHTML = "Неправильный логин или пароль!"
    else if ( data.status === 500 )
        li.innerHTML = "Упс, что-то пошло не так. Повторите попытку через пару часов"
    else if ( data.status === 200 ){
        $('#enterToAccModal').modal('close');
        li.innerHTML = "Вы вошли в аккаунт"
        setTimeout(function() {location.href = '/'}, 1000);
    }
    $('#showResultModal').modal('open');
}

function formSuccessReg( data ) {
    let show = document.getElementById('showResultModal')
    let h4 = show.getElementsByTagName('h5')[0]

    if ( data.status === 400 )
        h4.innerHTML = "Такой аккаунт уже существует!"
    else if ( data.status === 500 )
        h4.innerHTML = "Упс, что-то пошло не так. Повторите попытку через пару часов"
    else if ( data.status === 403 )
        h4.innerHTML = "Нельзя больше 3х аккаунтов в сутки!"

    if ( data.status === 201  )
        $('#writeHashOneModel').modal('open');
    else
        $('#showResultModal').modal('open');
}

function checkHashFormOneSuccessReg( data ) {
    let show = document.getElementById('showResultModal')
    let li = show.getElementsByTagName('h5')[0]

    if ( data.status === 400 )
        li.innerHTML = "Неправильный код!"
    else if ( data.status === 500 )
        li.innerHTML = "Упс, что-то пошло не так. Повторите попытку через пару часов"
    else if ( data.status === 200 ){
        $('#enterToAccModal').modal('close');
        $('#writeHashOneModel').modal('close');
        li.innerHTML = "Аккаунт успешно подтвержден!"
        setTimeout(function() {location.href = '/'}, 1000);
    }

    $('#showResultModal').modal('open');
}
function checkHashForChangePass( data ) {
    let show = document.getElementById('showResultModal')
    let li = show.getElementsByTagName('h5')[0]

    if ( data.status === 400 )
        li.innerHTML = "Неправильный код!"
    else if ( data.status === 500 )
        li.innerHTML = "Упс, что-то пошло не так. Повторите попытку через пару часов"
    else if ( data.status === 200 ){
        $('#enterToAccModal').modal('close');
        $('#regainPassModal').modal('close');
        $('#writeHashRegainPassModal').modal('close');
        let nick = document.getElementById('userNickname')
        nick.innerHTML = `<span class="black-text name">${data.person.name}</span>`
        li.innerHTML = "Вы изменили пароль!"
    }

    $('#showResultModal').modal('open');
}

function sendHashForChangePass( data ) {
    if ( data.status === 200 )
        $('#writeHashRegainPassModal').modal('open');
    else if ( data.status === 500 ){
        let show = document.getElementById('showResultModal')
        let li = show.getElementsByTagName('h5')[0]
        li.innerHTML = "Упс, что-то пошло не так. Повторите попытку через пару часов"
        $('#showResultModal').modal('open');
    }
}