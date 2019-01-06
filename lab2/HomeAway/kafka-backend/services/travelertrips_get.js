var {Users} = require('../models/userinfo');
var {mongoose} = require('../db/mongoose');

function handle_request(msg, callback){
    var res = {};
    console.log("\nIn handle request for traveler profile post:\n"+ JSON.stringify(msg));

    var setEmail = msg.setEmail
    
    Users.aggregate([
        // { email : setEmail},
        { $unwind :'$bookedPropertyDetails'},
        { $match : {'email': setEmail}},
        { $project : { _id: 0, bookedPropertyDetails: 1, email: 1 } }
        ],
        function(err,resultNew){
            if(err){
                console.log("Some error occured in handle_request of travelertrips_get.js of kafka-backend");
                callback(err,"Some error occured");
            }
            else{
                console.log("\n ----- Proper query execution -------");
                var newresult = [];
                for(let i=0;i<resultNew.length; i++){
                    newresult.push(resultNew[i].bookedPropertyDetails)
                }
                callback(null,newresult);
            }
        }
    );

}

exports.handle_request = handle_request;