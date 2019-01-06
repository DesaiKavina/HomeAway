var {Users} = require('../models/userinfo');
var {mongoose} = require('../db/mongoose');

function handle_request(msg, callback){
    // var res = {};
    console.log("\nIn handle request for traveler ask question:\n"+ JSON.stringify(msg));

    var setEmail = msg.setEmail
    var flag = false

    //for updation in owner record
    Users.updateOne(
        { $and: [{ email: setEmail }, { 'conversations.TravelerQuestion': msg.TravelerQuestion}, {'conversations.askedBy':msg.askedBy}, {'conversations.propertyName':msg.propertyName} ]},
        { $set : {"conversations.$.OwnerAnswer" : msg.OwnerAnswer, "conversations.$.answeredBy" : msg.answeredBy}},
        { upsert: true }, 
        function (err,result1) {
            if (err) {
                flag = false
                console.log("Some error occured in handle_request of ownerinbox_post.js of kafka-backend");
                callback(err,"Some error occured, cannot connect to db"); 
            }
            else {
                console.log("Owner's record updated!");

                //for updation in traveler record
                Users.updateOne(
                    { $and: [{ email: msg.askedBy }, { 'conversations.TravelerQuestion': msg.TravelerQuestion}, {'conversations.askedBy':msg.askedBy}, {'conversations.propertyName':msg.propertyName} ]},
                    { $set : {"conversations.$.OwnerAnswer" : msg.OwnerAnswer, "conversations.$.answeredBy" : msg.answeredBy}},
                    { upsert: true }, 
                    function (err,result2) {
                        if (err) {
                            flag = false
                            console.log("Some error occured in handle_request of ownerinbox_post.js of kafka-backend");
                            callback(err,"Some error occured, cannot connect to db"); 
                        }
                        else {
                            console.log("Traveler's record updated!");
                            callback(null, result2)
                        }
                    })
            }
        })

}

exports.handle_request = handle_request;