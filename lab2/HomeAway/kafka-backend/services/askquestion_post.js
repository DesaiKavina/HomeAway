var {Users} = require('../models/userinfo');
var {mongoose} = require('../db/mongoose');

function handle_request(msg, callback){
    var res = {};
    console.log("\nIn handle request for traveler ask question:\n"+ JSON.stringify(msg));

    var setEmail = msg.setEmail

    Users.update(
        { email: setEmail },
        {
            $push: {
                conversations: {
                    TravelerQuestion: msg.TravelerQuestion,
                    askedBy: msg.askedBy,
                    OwnerAnswer: "",
                    answeredBy: "",
                    propertyName: msg.PropertyName
                }
            }
        },
        { upsert: true },
        function( err, result ) 
        {
            if ( err ) {
                console.log("Some error occured in handle_request of ownerlogin_post.js of kafka-backend");
                callback(err,"Some error occured, cannot connect to db"); 
            }
            else{
                console.log("Traveler record updated for conversations");
                console.log("\n************************** Printing the output of first query **********************\n")
                console.log(result);

                Users.update(
                    {email: msg.propertyOwner},
                    {
                        $push : {
                            conversations: {
                                TravelerQuestion: msg.TravelerQuestion,
                                askedBy: msg.askedBy,
                                OwnerAnswer: "",
                                answeredBy: "",
                                propertyName: msg.PropertyName
                            }
                        }
                    },
                    { upsert: true },
                    function( err, result2 ) 
                    {
                        if ( err ) {
                            console.log("Some error occured in handle_request of askquestion_post.js of kafka-backend");
                            callback(err,"Some error occured, cannot connect to db"); 
                        }
                        else{
                            console.log("Owner record updated for conversations");
                            console.log("\n*********************** The second query also executed successfully ***********************\n")
                            console.log(result2);
                            callback(null,result2);
                        }
                    }
                )

                // callback(null,result);
            }
        }
    );

}

exports.handle_request = handle_request;