const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

const listOfCities   = new Schema({
    cities: [String]
});

module.exports = mongoose.model('listOfCities', listOfCities);