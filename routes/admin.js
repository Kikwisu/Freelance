const express = require('express');
const router = express.Router();


const mongoose = require('mongoose')
mongoose.Promise = global.Promise
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)

let User = require('./userModel')
let Orders= require('./Orders')
let ShowOrders= require('./ShowOrders')
let Stats= require('./stats')
let ListOfCities= require('./listOfCities')
let Cars= require('./Cars')

/* GET home page. */
router.post('/getUsersByQuery', function(req, res) {

  if(req.session.user){
    if(req.session.user.permissions === 2){
      let date = req.body.date
      let email = req.body.email
      let phone = req.body.phone
      let key = {}

      if(date)
        key.dateOfCreation = date
      if(email)
        key.email = email
      if(phone)
        key.phone = phone

      User.find(key).then((doc) => {
        if(doc.length === 0){
          res.send({status: 404, persons: null})
        } else{
          let Statistic = {}
          for(let person of doc){
            let email = person.email
            Stats.find({email}).then((doc2) => {
              if(doc2.length === 0)
                Statistic[email] = 0
              else
                Statistic[email] = doc2.accepted.length

              res.send({status: 302, persons: doc, stats: Statistic})
            })
          }
        }
      })
    } else{
      res.send({status: 403})
    }
  } else res.send({status: 400})

});

router.post('/changAccount', function(req, res) {
  if(req.session.user){
    if(req.session.user.permissions === 2){
      let searching = req.body.email

      let updates = req.body

      User.findOne({email: searching})
          .then((doc) => {

            doc.email = updates.email
            doc.phone = updates.phone
            doc.addresses = updates.addresses
            doc.name = updates.name
            doc.verification = updates.verification
            doc.date = updates.date
            doc.permissions = Number(updates.permissions)

            doc.save((err) => {
              if(err){
                res.send({status: 500})
                console.error(err);
              } else
                res.send({status: 200})
            })
          })

    } else{
      res.send({status: 403})
    }
  } else res.send({status: 400})
});

router.post('/removeAccount', function(req, res) {
  if(req.session.user){
    if(req.session.user.permissions === 2){
      let email = req.body.email

      User.deleteOne({ email }, (err) => {
            if (err){
              console.log(handleError(err))
              res.send({status: 500})
            } else{
              res.send({status: 200})
            }
          })

    } else{
      res.send({status: 403})
    }
  } else res.send({status: 400})
});

router.post('/getOrdersByQuery', function(req, res) {

  if(req.session.user){
    if(req.session.user.permissions > 0){

      let date = req.body.date
      let phone = req.body.phone
      let key = {}

      if(date)
        key.date = date
      if(phone)
        key.phone = phone

      Orders.find( key ).then((doc) => {
        if(doc.length === 0){
          res.send({status: 404, orders: null})
        } else{
          res.send({status: 302, orders: doc})
        }
      })
    } else{
      res.send({status: 403})
    }
  } else res.send({status: 400})

});

router.post('/accessOrder', function(req, res) {

  if(req.session.user){
    if(req.session.user.permissions > 0){

      let   label = req.body.label
          , model = req.body.model
          , year = req.body.year
          , vin = req.body.vin
          , details = req.body.details
          , city = req.body.city
          , phone = req.body.phone
          , date = req.body.date
          , time = req.body.time

      ShowOrders.findOne({ label, model, year, vin, details, city, phone, date, time })
          .then(function(doc){
            if(doc === null){
              let order = new ShowOrders({
                label,
                model,
                year,
                vin,
                details,
                city,
                phone,
                date,
                time
              })

              let ORDER = order

              order.save((err) => {
                if(err){
                  res.send({status: 500})
                  console.error(err);
                } else{
                  Orders.deleteOne({ label, model, year, vin, details, city, phone, time }, (err) => {
                    if (err){
                      console.log(handleError(err))
                      res.send({status: 500})
                    } else{

                      res.send({status: 200, order: ORDER})
                    }
                  })
                }
              })
            } else{
            }
          })
    } else{
      res.send({status: 403})
    }
  } else res.send({status: 400})

});
router.post('/removeOrder', function(req, res) {

  if(req.session.user){
    if(req.session.user.permissions > 0){

      let   label = req.body.label
          , model = req.body.model
          , year = req.body.year
          , vin = req.body.vin
          , details = req.body.details
          , city = req.body.city
          , phone = req.body.phone
          , date = req.body.date
          , time = req.body.time

      Orders.deleteOne({ label, model, year, vin, details, city, phone, date, time }, (err) => {
        if (err){
          console.log(handleError(err))
          res.send({status: 500})
        } else{
          res.send({status: 200})
        }
      })
    } else{
      res.send({status: 403})
    }
  } else res.send({status: 400})

});

router.post('/addCity', function(req, res) {

  if(req.session.user){
    if(req.session.user.permissions === 2){

      let city = req.body.city

      ListOfCities.find()
          .then(function(doc){
            if(doc.length === 0){
              let cityNew = new ListOfCities({
                cities: [city]
              })

              cityNew.save((err) => {
                if(err){
                  res.send({status: 500})
                  console.error(err);
                } else{
                  res.send({status: 200})
                }
              })
            } else{
              doc[0].cities.push(city)
              doc[0].save((err) => {
                if(err){
                  res.send({status: 500})
                  console.error(err);
                } else{
                  res.send({status: 200})
                }
              })
            }
          })
    } else{
      res.send({status: 403})
    }
  } else res.send({status: 400})

});

router.post('/removeCity', function(req, res) {

  if(req.session.user){
    if(req.session.user.permissions === 2){

      let city = req.body.city

      ListOfCities.find()
          .then(function(doc){
            if(doc.length === 0){

              res.send({status: 500})

            } else{

              let index = doc[0].cities.indexOf(city)

              if (index > -1) {
                doc[0].cities.splice(index, 1);
              }

              doc[0].save((err) => {
                if(err){
                  res.send({status: 500})
                  console.error(err);
                } else{
                  res.send({status: 200})
                }
              })

            }
          })
    } else{
      res.send({status: 403})
    }
  } else res.send({status: 400})

});

router.post('/addLabel', function(req, res) {

  if(req.session.user){
    if(req.session.user.permissions === 2){

      let label = req.body.label

      Cars.findOne({label})
          .then(function(doc){
            if(doc === null){
              let car = new Cars({
                label,
                models: []
              })
              car.save((err) => {
                if(err){
                  res.send({status: 500})
                  console.error(err);
                } else{
                  res.send({status: 200})
                }
              })
            } else{
                res.send({status: 500})
            }
          })
    } else{
      res.send({status: 403})
    }
  } else res.send({status: 400})

});

router.post('/removeLabel', function(req, res) {

  if(req.session.user){
    if(req.session.user.permissions === 2){

      let label = req.body.label

      Cars.deleteOne({label}, err => {
        if (err){
          console.log(handleError(err))
          res.send({status: 500})
        } else{
          res.send({status: 200})
        }
      })

    } else{
      res.send({status: 403})
    }
  } else res.send({status: 400})

});

router.post('/addModel', function(req, res) {

  if(req.session.user){
    if(req.session.user.permissions === 2){

      let label = req.body.label
      let model = req.body.model

      Cars.findOne({label})
          .then(function(doc){
            if(doc === null){
              res.send({status: 500})
            } else{
                doc.models.push(model)
                doc.save((err) => {
                  if(err){
                    res.send({status: 500})
                    console.error(err);
                  } else{
                    res.send({status: 200})
                  }
                })
            }
          })
    } else{
      res.send({status: 403})
    }
  } else res.send({status: 400})

});

router.post('/removeLabel', function(req, res) {

  if(req.session.user){
    if(req.session.user.permissions === 2){

      let label = req.body.label

      Cars.deleteOne({label}, err => {
        if (err){
          console.log(handleError(err))
          res.send({status: 500})
        } else{
          res.send({status: 200})
        }
      })

    } else{
      res.send({status: 403})
    }
  } else res.send({status: 400})

});





module.exports = router;
