var {Users} = require('../models/userinfo');
var {mongoose} = require('../db/mongoose');

function handle_request(msg, callback){
    var res = {};
    console.log("\nIn handle request for traveler profile post:\n"+ JSON.stringify(msg));

    var setEmail = msg.setEmail;
    var filename = msg.filename;
    Users.update(
        // { email: req.session.emailT },
        { email: setEmail },
        {
            profileImage: filename
        },
        { upsert: true },
        function( err, result ) 
        {
            if ( err ) {
                console.log("Some error occured in handle_request of travelerprofileimage_post.js of kafka-backend");
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