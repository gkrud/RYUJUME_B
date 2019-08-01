const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const crypto = require('crypto');

const User = new Schema({
    id:String,
    pw:String,
    userName:String,
    likeRyujume:[String],
    // salt: Buffer,
});

// User.statics.create = (id,pw,userName,salt) =>{
//     const user = new User();
//     user.id = id;
//     user.pw = pw;
//     user.userName = userName;
//     user.salt = salt;
//     return user.save();
// }

User.methods.verify = async (pw) => {
    // let isCorrect = await crypto.pbkdf2(pw,this.salt,180822,64,'sha512');
    // return isCorrect.toString('base64') === this.pw;
    return pw === this.pw;
}

module.exports = mongoose.model('User', User);