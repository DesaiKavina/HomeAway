// var mongo = require('./mongo');
var bcrypt = require('bcryptjs');

var {Users} = require('../models/userinfo');
var {mongoose} = require('../db/mongoose');

function handle_request(msg, callback){
    var res = {};
    console.log("\nIn handle request for traveler signup post:\n"+ JSON.stringify(msg));

    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(msg.password, salt);

    var newTraveler = new Users({
        firstname: msg.firstname,
        lastname: msg.lastname,
        email: msg.email,
        password : hash,
        userflag: 'T'
    })

    newTraveler.save().then((newTraveler)=>{
        console.log("New traveler account created !!");
        console.log(newTraveler)
        callback(null,newTraveler);
    },(err)=>{
        console.log("Error While signing up traveler");
        callback(err,"Some error occured");
    })
}

exports.handle_request = handle_request;