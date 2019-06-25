const express = require('express');
const router = express.Router();

let User = require('./userModel')
let ListOfCities= require('./listOfCities')
let Cars= require('./Cars')

/* GET home page. */
router.get('/', function(req, res, next) {

  if(req.session.user){

    let email = req.session.user.email
    User.findOne({email}).then((doc)=>{
      ListOfCities.find().then((Cities) => {
        let Data = []
        if(Cities[0] !== undefined)
          Data = Cities[0].cities
        Cars.find().then((Cars) => {
          res.render('index', { person: doc, Cities: Data, Cars });
        })
      })
    })
  } else{
    ListOfCities.find().then((Cities) => {
      let Data = []
      if(Cities[0] !== undefined)
        Data = Cities[0].cities
      Cars.find().then((Cars) => {
        res.render('index', { person: null, Cities: Data, Cars });
      })
    })
  }
});


router.post('/getModels', function(req, res, next) {
  let label = req.body.label
  Cars.findOne({label}).then(doc => {
    if(doc !== null)
      res.send(doc);
  })
});

router.post('/getMain', function(req, res, next) {
  ListOfCities.find().then((Cities) => {
    let Data = []
    if(Cities[0] !== undefined)
      Data = Cities[0].cities
    Cars.find().then((Cars) => {
      res.render('main', { Cities: Data, Cars });
    })
  })
});

router.post('/getPrivateOffice', function(req, res, next) {
  res.render('privateOffice');
});

router.post('/getSettings', function(req, res, next) {
  if(req.session.user){
    let email = req.session.user.email
    User.findOne({email}).then((doc)=>{
      res.render('settings', { person: doc });
    })
  }
});

router.post('/getAdminPanel', function(req, res, next) {
  if(req.session.user){
    if(req.session.user.permissions === 2){
      let email = req.session.user.email
      User.findOne({email}).then((doc)=>{
        ListOfCities.find().then((Cities) => {
          let Data = []
          if(Cities[0] !== undefined)
            Data = Cities[0].cities
          Cars.find().then((Cars) => {
            res.render('adminPanel', { person: doc, Cities: Data, Cars });
          })
        })
      })
    }
  }
});

router.post('/getModerPanel', function(req, res, next) {
  if(req.session.user){
    if(req.session.user.permissions > 0){
      res.render('moderPanel');
    }
  }
});

module.exports = router;
