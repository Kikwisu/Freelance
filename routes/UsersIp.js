const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

const UsersIp = new Schema({
    ip: String,
    count: Number
});

module.exports = mongoose.model('UsersIp', UsersIp);