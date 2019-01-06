var bcrypt = require('bcryptjs');

var {Users} = require('../models/userinfo');
var {mongoose} = require('../db/mongoose');

function handle_request(msg, callback){
    var res = {};
    console.log("\nIn handle request for owner login post:\n"+ JSON.stringify(msg));
    var email = msg.email;
    var password = msg.password;

    Users.findOne({
        email:msg.email
    }, function(err,validuser){
        if (err) {
            console.log("Some error occured in handle_request of ownerlogin_post.js of kafka-backend");
            callback(err,"Some error occured, cannot connect to db"); 
        } 
        else {
            console.log("Printing the validuser : ");
            console.log(JSON.stringify(validuser));
            if(validuser && bcrypt.compareSync(msg.password, validuser.password)){
                console.log("\nThe entered email and password matches with the records in the database");
                callback(null,validuser);
            }
            else{
                console.log("The entered passwords did not match");
                callback(null,"The entered passwords did not match");
            } 
        }
    })
}

exports.handle_request = handle_request;