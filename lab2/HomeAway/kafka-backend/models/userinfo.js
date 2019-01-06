var mongoose = require('mongoose');

var Users = mongoose.model('Users',{
    firstname :{
        type : String,
        required : true
    },
    lastname : {
        type : String,
        required : true
    },
    email : {
        type : String,
        unique: true,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    aboutme : {
        type : String
    },
    city : {
        type : String
    },
    country : {
        type : String
    },
    company : {
        type : String
    },
    school : {
        type : String
    },
    hometown : {
        type : String
    },
    languages : {
        type : String
    },
    gender : {
        type : String
    },
    profileImage : {
        type : String
    },
    phoneno : {
        type : String
    },
    userflag : {
        type : String
    },
    propertyDetails : {
        type : Array
    },
    bookedPropertyDetails : {
        type : Array
    },
    conversations : {
        type : Array
    }

});

module.exports = {Users};