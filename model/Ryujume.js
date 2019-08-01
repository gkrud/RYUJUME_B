const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Ryujume = new Schema({
    userName:String,
    id:String,
    profileImg:String,
    phoneNumber:String,
    email:String,
    simpleInfo:String,
    career:[{
        isServed:Boolean,
        companyName:String,
        startDate:Number,
        endDate: Number,
    }],
    academicBack:[{
        isInSchool:Boolean,
        schoolName:String,
        startDate:Number,
        endDate: Number,
    }],
    prize:[{
        title:String,
        prizeDate:Number,
    }],
    language:[{
        languageName:String,
        level:String
    }],
    link:[String],
    likeNumber: Number,
    date:{type:Date,default:Date.now},
});

// Ryujume.statics.create = (userName,id,phoneNumber,email,simpleInfo,career,academicBack,prize,language,link)=>{
//     const ryujume = new Ryujume({
//         userName,
//         id,
//         phoneNumber,
//         email,
//         simpleInfo,
//         career,
//         academicBack,
//         prize,
//         language,
//         link
//     });
//     return ryujume.save();
// }

module.exports = mongoose.model('Ryujume', Ryujume);