const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

const Stats = new Schema({
    email: String,
    accepted: [String]
});

module.exports = mongoose.model('Stats', Stats);