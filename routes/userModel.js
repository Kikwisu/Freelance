const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

const User = new Schema({
    password: String,
    name: String,
    phone: String,
    email: String,
    addresses: String,
    verification: Boolean,
    dateOfCreation: String,
    date: String,
    lastLogin: String,
    permissions: Number
});

module.exports = mongoose.model('User', User);