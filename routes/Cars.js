const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

const Cars = new Schema({
    label: String,
    models: [String]
});

module.exports = mongoose.model('Cars', Cars);