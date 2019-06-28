const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema({
    id:String,
    pw:String,
    userName:String,
    like:[String],
});

module.exports = mongoose.model('User', User);