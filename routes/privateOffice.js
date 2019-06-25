const express = require('express');
const router = express.Router();
const crypto = require('crypto')
const app = express()

const mongoose = require('mongoose')
mongoose.Promise = global.Promise
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const mailer = require("nodemailer")

let User = require('./userModel')
let ShowOrders= require('./ShowOrders')
let AcceptOrders= require('./AcceptOrders')
let Stats= require('./stats')

router.post('/getContent', function(req, res) {
  res.render('privateOffice')
})


router.post('/changeSettings', function(req, res) {
  if(req.session.user){
    let email = req.session.user.email

    let updates = req.body

      console.log(updates.addresses)

    User.findOne({email: email})
        .then((doc) => {
          doc.name = updates.name
          doc.phone = updates.phone
          doc.addresses = updates.addresses

          doc.save((err) => {
            if(err){
              res.send({status: 500})
              console.error(err);
            } else
              res.send({status: 200})
          })
        })

  } else res.send({status: 400})
});

router.post('/getOrdersByQuery', function(req, res) {
    if(req.session.user){
        let email = req.session.user.email

        User.findOne({email: email})
            .then((doc) => {
                if(Date.parse(doc.date) > Date.now() || req.session.user.permissions === 2){
                    let date = req.body.date
                    let phone = req.body.phone
                    let key = {}

                    if(date)
                        key.date = date
                    if(phone)
                        key.phone = phone

                    ShowOrders.find( key ).then((doc) => {
                        if(doc.length === 0){
                            res.send({status: 404, orders: null})
                        } else{
                            res.send({status: 302, orders: doc})
                        }
                    })
                }else
                    res.send({status: 403})
            })
    } else res.send({status: 400})

});

router.post('/acceptOrder', (req, res) => {
    if(req.session.user){

        let email = req.session.user.email

        let   label = req.body.label
            , model = req.body.model
            , year = req.body.year
            , vin = req.body.vin
            , details = req.body.details
            , city = req.body.city
            , phone = req.body.phone
            , time = req.body.time

        let Time = new Date()
        const monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        let date = `${Time.getDate()} ${monthNames[Time.getMonth()]}, ${Time.getFullYear()}`

        let key = {
            email,
            label,
            model,
            year,
            vin,
            details,
            city,
            phone,
            date,
            time
        }

        User.findOne({email: email})
            .then((doc) => {
                if(Date.parse(doc.date) > Date.now()  || req.session.user.permissions === 2){

                    Stats.findOne({email}).then((doc2) => {
                        if(doc2 === null){
                            let stats = new Stats({
                                email,
                                accepted: [JSON.stringify(key)]
                            })
                            stats.save().then( ()=>{
                                ShowOrders.deleteOne({ label, model, year, vin, details, city, phone, time }, (err) => {
                                    if (err){
                                        console.log(handleError(err))
                                        res.send({status: 500})
                                    }else
                                        res.send({status: 201})
                                })
                            }).catch((err) => {
                                console.log(err)
                                res.send({status: 500})
                            })
                        }
                        else{

                            doc2.accepted.push(JSON.stringify(key))
                            doc2.save().then( ()=>{

                                ShowOrders.deleteOne({ label, model, year, vin, details, city, phone, time }, (err) => {
                                    if (err){
                                        console.log(handleError(err))
                                        res.send({status: 500})
                                    }else{
                                        res.send({status: 201})
                                    }
                                })
                            }).catch((err) => {
                                console.log(err)
                                res.send({status: 500})
                            })
                        }
                    })
                }else
                    res.send({status: 403})
            })

    }else res.send({status: 400})
})

router.post('/getStats', (req, res) => {
  let email = req.session.user.email

    Stats.findOne({email}).then( doc => {
        if(doc === null)
            return res.send({stats: []})
        else
            return res.send({stats: doc.accepted})
    })
})

module.exports = router;
