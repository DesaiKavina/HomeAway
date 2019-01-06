var {Users} = require('../models/userinfo');
var {mongoose} = require('../db/mongoose');

function handle_request(msg, callback){
    var res = {};
    console.log("\nIn handle request for owner dashboard data of images:\n"+ JSON.stringify(msg));

    var setEmail = msg.setEmail

    Users.find(
        { email: setEmail },
        { propertyDetails: 1, _id: 0 },
        function (err, result) {
            if (err) {
                console.log("Error in getting owner's property details");
                console.log("Some error occured in handle_request of ownerdashboarddata_get.js of kafka-backend");
                callback(err,"Some error occured, cannot connect to db"); 
            } 
            else {
                console.log("--------- Extracted owner property images from the mongoDB collection ----------");
                callback(null,result);
            }
        }
    );

}

exports.handle_request = handle_request;