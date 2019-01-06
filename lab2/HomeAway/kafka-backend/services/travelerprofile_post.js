var {Users} = require('../models/userinfo');
var {mongoose} = require('../db/mongoose');

function handle_request(msg, callback){
    var res = {};
    console.log("\nIn handle request for traveler profile post:\n"+ JSON.stringify(msg));

    var setEmail = msg.setEmail
    Users.update(
        { email: setEmail },
        {
            firstname: msg.firstname,
            lastname: msg.lastname,
            aboutme: msg.aboutme,
            city: msg.city,
            country: msg.country,
            company: msg.company,
            school: msg.school,
            hometown: msg.hometown,
            languages: msg.languages,
            phoneno: msg.phoneno,
            gender: msg.gender,
        },
        { upsert: true },
        function( err, result ) 
        {
            if ( err ) {
                console.log("Some error occured in handle_request of travelerprofile_post.js of kafka-backend");
                callback(err,"Some error occured"); 
            }
            else{
                console.log("Traveler info updated successfully");
                callback(null,result);
            }
        }
        );
}

exports.handle_request = handle_request;