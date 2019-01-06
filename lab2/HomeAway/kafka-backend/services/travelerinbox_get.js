var {Users} = require('../models/userinfo');
var {mongoose} = require('../db/mongoose');

function handle_request(msg, callback){
    var res = {};
    console.log("\nIn handle request for traveler inbox get data:\n"+ JSON.stringify(msg));

    var setEmail = msg.setEmail

    Users.find(
        { email: setEmail },
        { conversations: 1, _id: 0 },
        function (err, result) {
            if (err) {
                console.log("Some error occured in handle_request of travelerinbox_get.js of kafka-backend");
                callback(err,"Some error occured, cannot connect to db"); 
            } 
            else {
                console.log("\n--------- Extracted travler's conversation data from MongoDB ----------");
                var result1 = [];
                result1 = result[0].conversations;
                callback(null,result1);
            }
        }
    );
}

exports.handle_request = handle_request;