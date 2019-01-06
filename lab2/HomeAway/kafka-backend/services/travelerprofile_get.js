var {Users} = require('../models/userinfo');
var {mongoose} = require('../db/mongoose');

function handle_request(msg, callback){
    var res = {};
    console.log("\nIn handle request for traveler profile post:\n"+ JSON.stringify(msg));

    var setEmail = msg.setEmail
    
    Users.findOne({
        // email:req.session.emailT
        email:setEmail
    }, function(err,result){
        if (err) {
            console.log("Some error occured in handle_request of travelerprofile_get.js of kafka-backend");
            callback(err,"Some error occured");
        } 
        else {
           console.log("Traveler data successfully extracted from mongodb");
            var filename = result.profileImage;
            if(filename==undefined){
                console.log("Profile image not yet set");
                callback(null,result);
                // res.end(JSON.stringify(result));
            }
            else {
                console.log("Found profile image in the database");
                console.log("Profileimage from the database : "+result.profileImage);
                // console.log("Type of result is : "+typeof(result));
                
                // res.end(JSON.stringify(result));
                callback(null,result);
            }
        }
    })

}

exports.handle_request = handle_request;