const express = require('express')
const router = express.Router()
const crypto = require('crypto')

const mongoose = require('mongoose')
mongoose.Promise = global.Promise
const Schema = mongoose.Schema
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const mailer = require("nodemailer")

let User = require('./userModel')
let UserHash = require('./userHash')
let UsersIps= require('./UsersIp')
let UserHashForPass = require('./userHashForPass')

let config = 'mongodb://localhost:27017/loginDB,localhost:27021,localhost:27020'

mongoose.connect("mongodb://localhost:27017/loginDB",  { useNewUrlParser: true })

function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

router.post('/login', function(req, res) {
    if(req.session.user){
        let User = require('./userModel')
        let email = req.session.user.email
        User.findOne({email}).then((doc)=>{
            return res.send({status: 200, person: doc})
        })
    }


    let User = require('./userModel')
    let login = req.body.login
    let password = req.body.password
    let key = {}


    if (validateEmail(login))
        key = {email: login.toLowerCase()}
    else
        key = {phone: login}

    const hash = crypto.createHash('sha256')
    password = hash.update(password).digest('hex')

    User.findOne(key)
        .then(function(doc){
            if(doc === null){
                console.log("here")
                return res.send({status: 400})
            }


            if(doc.password === password){
                let Time = new Date()
                let time = `${Time.getDate()} ${Time.getMonth()} ${Time.getFullYear()}`
                doc.lastLogin = time

                doc.save((err) => {
                    if(err){
                        res.send({status: 500})
                        console.error(err);
                    } else{
                        req.session.user = { email: doc.email, permissions : doc.permissions }
                        return res.send({status: 200, person: doc})
                    }
                })
            }
            else{
                console.log("here2")
                res.send({status: 400})
            }


        })
        .catch(function (err){
            console.log(err);
        });

});

router.post('/register', function(req, res) {

    if(req.session.user)
        return res.send({status: 500})
    let   password = req.body.password
        , name = req.body.name
        , phone = req.body.phone
        , email = req.body.email
        , ip = req.connection.remoteAddress

    email = email.toLowerCase()


    ip = ip + '';

    UsersIps.findOne({ip})
        .then((doc) => {
            if(doc !== null)
                if(doc.count > 3)
                    return res.send({status: 403})
        })

    let Time = new Date()
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    let time = `${Time.getDate()} ${monthNames[Time.getMonth()]}, ${Time.getFullYear()}`

    console.log('here')

    const hash1 = crypto.createHash('sha256')
    password = hash1.update(password).digest('hex')

    const hash2 = crypto.createHash('sha256')
    let loginHash = hash2.update(email+time).digest('hex')

    User.findOne({email: email} || {phone: phone})
        .then(function(doc){

            if(doc === null){

                let user = new User({
                    password,
                    name,
                    phone,
                    email,
                    verification: false,
                    date: time,
                    dateOfCreation: time,
                    lastLogin: time,
                    permissions: 0
                })

                user.save()
                    .then(function(){

                        UsersIps.findOne({ip})
                            .then((doc) => {
                                if(doc !== null){
                                    doc.count++
                                }else{
                                    let ip2 = new UsersIps({ ip, count: 1 })
                                    ip2.save()
                                }
                            })

                        req.session.user = { email: email, permissions: 0 }

                        UserHash.findOne({email})
                            .then(function(doc){

                                if(doc === null){
                                    let mail = new UserHash({
                                        email: email,
                                        hash: loginHash
                                    })

                                    mail.save()
                                        .then(function(){

                                            let transporter = mailer.createTransport({
                                                host: 'smtp.gmail.com',
                                                port: '587',
                                                auth: {
                                                    user: 'gotsulyakit@gmail.com',
                                                    pass: 'SKETCHPAD228'
                                                },
                                                secureConnection: 'false',
                                                tls: {
                                                    ciphers: 'SSLv3',
                                                    rejectUnauthorized: false
                                                }
                                            });

                                            let mailOptions = {
                                                from: 'gotsulyakit@gmail.com',
                                                to: email,
                                                subject: 'Подвтерждение регистрации',
                                                text: `Ваш код: ${loginHash}`
                                            };

                                            transporter.sendMail(mailOptions, function(error, info){
                                                if (error) {
                                                    console.log(error);
                                                } else {
                                                    console.log('Email sent: ' + info.response);
                                                }
                                            });

                                        })
                                        .catch(function (err){
                                            console.log(err)
                                        })
                                }
                            })
                        res.send({status: 201})
                    })
                    .catch(function (err){
                        console.log(err)
                        return res.send({status: 500})
                    })

            }
            else{
                console.log(doc)
                return res.send({status: 400})
            }
        })
});

router.post('/checkHash', function(req, res) {

    console.log(req.body.hash)

    let hash  = req.body.hash

    UserHash.findOne({hash:hash})
        .then(function(doc){

            if(doc === null){
                console.log('here')
                res.send({status: 400, person: null})
            }

            else{
                console.log('here')
                User.findOne({email: doc.email}, function (err, user) {
                    user.verification = true
                    user.save(function (err) {
                        if(err) {
                            console.error('ERROR!');
                            res.send({status: 500, person: null})
                        } else{
                            UserHash.remove({ hash }, function (err) {
                                if (err){
                                    console.log(handleError(err))
                                    res.send({status: 500, person: null})
                                } else{
                                    res.send({status: 200, person: user})
                                }
                            })
                        }
                    })
                })
            }

        })

});

router.post('/changePassSendMail', function(req, res) {
    let email = ""
    if(req.session.user){
        email = req.session.user.email
    } else{
        email = req.body.email
    }
        const hash = crypto.createHash('sha256')
        let pass = req.body.password

        pass = hash.update(pass).digest('hex')


        const hash2 = crypto.createHash('sha256')
        let Time = new Date()

        let time = Time.getTime()
        let loginHash = hash2.update(email+time).digest('hex')

        UserHashForPass.findOne({email})
            .then(function(doc){

                if(doc === null){
                    let mail = new UserHashForPass({
                        email: email,
                        pass: pass,
                        hash: loginHash
                    })

                    mail.save()
                        .catch(function (err){
                            res.send({status: 500})
                            console.log(err)
                        })
                } else {
                    UserHashForPass.findOne({email}, function (err, userHash) {
                        userHash.hash = loginHash
                        userHash.save(function (err) {
                            if (err){
                                res.send({status: 500})
                                console.error(err);
                            }
                        })
                    })

                }
            })

        let transporter = mailer.createTransport({
            host: 'smtp.gmail.com',
            port: '587',
            auth: {
                user: 'gotsulyakit@gmail.com',
                pass: 'SKETCHPAD228'
            },
            secureConnection: 'false',
            tls: {
                ciphers: 'SSLv3',
                rejectUnauthorized: false
            }
        });

        let mailOptions = {
            from: 'gotsulyakit@gmail.com',
            to: email,
            subject: 'Смена пароля',
            text: `Ваш код для смены пароля: ${loginHash}`
        };

        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
            } else {
                res.send({status: 200})
                console.log('Email sent: ' + info.response);
            }
        });
});

router.post('/checkHashChangePass', function(req, res) {

    let hash  = req.body.hash

    UserHashForPass.findOne({hash:hash})
        .then(function(doc){

            if(doc === null){
                res.send({status: 400})
            }
            else{
                console.log('here')
                User.findOne({email: doc.email}, function (err, user) {
                    req.session.user = { email: doc.email, permissions : doc.permission}
                    user.password = doc.pass
                    user.save(function (err) {
                        if(err) {
                            console.error('ERROR!');
                            res.send({status: 500})
                        } else{
                            UserHashForPass.remove({ hash }, function (err) {
                                if (err){
                                    console.log(handleError(err))
                                    res.send({status: 500})
                                } else{
                                    res.send({status: 200, person: doc})
                                }
                            })
                        }
                    })
                })
            }

        })
});


router.post('/exit', function(req, res) {
    if(req.session.user){
        delete req.session.user;
        res.send({status: 200, person: null});
    } else {
        res.send({status: 500});
    }
})

module.exports = router;