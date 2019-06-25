const express = require('express');
const router = express.Router();

const mongoose = require('mongoose')
mongoose.Promise = global.Promise
const Schema = mongoose.Schema
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const mailer = require("nodemailer")

let User = require('./userModel')
let UserHash = require('./userHash')
let UsersIpOrders= require('./UsersIpOrders')
let Orders= require('./Orders')

/* GET home page. */
router.post('/add', function(req, res, next) {
  let   label = req.body.label
      , model = req.body.model
      , year = req.body.year
      , vin = req.body.vin
      , details = req.body.details
      , city = req.body.city
      , phone = req.body.phone
      , ip = req.connection.remoteAddress

  if(!label)
    return res.send({status: 501})
  if(!model)
    return res.send({status: 501})
  if(!year)
    return res.send({status: 501})
  if(!vin)
    return res.send({status: 501})
  if(!details)
    return res.send({status: 501})
  if(!city)
    return res.send({status: 501})
  if(!phone)
    return res.send({status: 501})

  let Time = new Date()
  let time = Time.getTime()
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  let date = `${Time.getDate()} ${monthNames[Time.getMonth()]}, ${Time.getFullYear()}`

  UsersIpOrders.findOne({ip})
      .then((doc) => {
        if(doc !== null)
          if(doc.count > 10)
            return res.send({status: 403})
      })

  let order = new Orders({
    label,
    model,
    year,
    vin,
    details,
    city,
    phone,
    date,
    time
  });

  order.save().then( ()=>{
    res.send({status: 201})
  }).catch((err) => {
    console.log(err)
    res.send({status: 500})
  })

});

module.exports = router;
