// var mongo = require('./mongo');
var bcrypt = require('bcryptjs');

var {Users} = require('../models/userinfo');
var {mongoose} = require('../db/mongoose');

// function handle_request(msg, callback){
//     var res = {};
//     console.log("\nIn handle request for traveler login post:"+ JSON.stringify(msg));

//     mongo.connect(function(err,db){
//         if(err){
//             callback(null,"Cannot connect to db");
//         }
//         else{
//             console.log('Connected to mongodb');
//             var query = {Email : msg.username};
//             var dbo = db.db('usersignup');
//             dbo.collection("usersignup").find(query).toArray(function(err,result){
//                 if(err){
//                     //throw err;
//                     callback(err,"Error");
//                 }
//                 if(result.length > 0){
//                     var hash = result[0].Password;
//                     bcrypt.compare(msg.password,hash,function(err,doesMatch){
//                         if(doesMatch){
//                             console.log("Inside result.length",result[0].userID);
                          
//                             callback(null,result);
//                         } else {
//                             callback(null,[]);
//                         }
//                     });
//                 }
//                 else{
//                     callback(null,[]);
//                 }
//             });
//         }
//     });

//     /*if(msg.username == "bhavan@b.com" && msg.password =="a"){
//         res.code = "200";
//         res.value = "Success Login";

//     }
//     else{
//         res.code = "401";
//         res.value = "Failed Login";
//     }
//     callback(null, res);*/
// }

function handle_request(msg, callback){
    var res = {};
    console.log("\nIn handle request for traveler login post:\n"+ JSON.stringify(msg));
    var email = msg.email;
    var password = msg.password;

    Users.findOne({
        email:msg.email
    }, function(err,validuser){
        if (err) {
            console.log("Some error occured in handle_request of travelerlogin_post.js of kafka-backend");
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
        // else{
        //     console.log("The result lenght is not greater zero");
        //     console.log("Inside the final else in kafka-backend");
        //     callback(null,[]);
        // }
    })
}

exports.handle_request = handle_request;