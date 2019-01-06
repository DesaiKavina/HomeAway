var {Users} = require('../models/userinfo');
var {mongoose} = require('../db/mongoose');

function handle_request(msg, callback){
    var res = {};
    console.log("\nIn handle request for owner property price post:\n"+ JSON.stringify(msg));

    var setEmail = msg.setEmail

    Users.update(
        { email: setEmail },
        {
            $push: {
                propertyDetails: {
                    pCountry: msg.country,
                    pAddress: msg.address,
                    pCity: msg.city,
                    pState: msg.state,
                    pZipcode: msg.zipcode,
                    pName: msg.propertyname,
                    pDescription: msg.propertydesc,
                    pType: msg.propertytype,
                    pBedrooms: msg.bedrooms,
                    pBathrooms: msg.bathrooms,
                    pAccomodates: msg.accomodates,
                    pImageFiles: msg.imagefiles,
                    pAvailableStart: msg.availableStart,
                    pAvailableEnd: msg.availableEnd,
                    pPricePerNight: msg.pricePerNight
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
                console.log("Owner property details added successfully in the database");
                callback(null,result);
            }
        }
    );

}

exports.handle_request = handle_request;