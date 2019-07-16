const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const crypto = require('crypto');

const User = new Schema({
    id:String,
    pw:String,
    userName:String,
    like:[String],
    salt: String,
});

User.statics.create = (id,pw,userName,salt) =>{
    const user = new this({
        id,
        pw,
        userName,
        salt
    });
    return user.save();
}

User.methods.verify = async (pw) => {
    let isCorrect = await crypto.pbkdf2(pw,this.salt,180822,64,'sha512');
    return isCorrect.toString('base64') === this.pw;
}

module.exports = mongoose.model('User', User);