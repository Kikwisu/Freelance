const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

const userHashForPass = new Schema({
    email: String,
    pass: String,
    hash: String
});

module.exports = mongoose.model('userHashForPass', userHashForPass);