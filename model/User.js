const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const crypto = require('crypto');

const UserSchema = new Schema({
    id:String,
    pw:String,
    userName:String,
    likeRyujume:[String],
    salt: String,
});

UserSchema.statics.create = (id,pw,userName,salt) => {
    return new User({
        id,
        pw,
        userName,
        salt,
    }).save();
}

UserSchema.methods.verify = (obj, pw) => {
    let isCorrect = crypto.pbkdf2Sync(pw.toString(),obj.salt,180822,64,'sha512');
    let i = isCorrect.toString('base64') === obj.pw;

    console.log(isCorrect.toString('base64'));
    console.log(obj.pw);

    return isCorrect.toString('base64') === obj.pw;
    //return pw === this.pw;
}

const User = mongoose.model('User', UserSchema);

module.exports = User;