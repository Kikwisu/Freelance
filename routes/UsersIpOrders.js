const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

const UsersIpOrders = new Schema({
    ip: String,
    count: Number
});

module.exports = mongoose.model('UsersIpOrders', UsersIpOrders);