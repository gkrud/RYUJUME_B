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
        detail:String,
        prizeDate:Number,
    }],
    language:[{
        languageName:String,
        level:String
    }],
    link:[String],
    likedUser:[String],
    date:{type:Date,default:Date.now},
});

module.exports = mongoose.model('Ryujume', Ryujume);