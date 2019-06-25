const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

const AcceptOrders = new Schema({
    email: String,
    label: String,
    model: String,
    year: String,
    vin: String,
    details: String,
    city: String,
    phone: String,
    date: String,
    time: String
});

module.exports = mongoose.model('AcceptOrders', AcceptOrders);