const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: String,
    hash: String
});

module.exports = mongoose.model('UserHash', UserSchema);