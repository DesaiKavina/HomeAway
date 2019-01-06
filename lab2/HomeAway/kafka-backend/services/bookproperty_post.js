var {Users} = require('../models/userinfo');
var {mongoose} = require('../db/mongoose');

function handle_request(msg, callback){
    var res = {};
    console.log("\nIn handle request for traveler profile post:\n"+ JSON.stringify(msg));

    var setEmail = msg.setEmail;
    var propertyname = msg.bookpropertyname;
    var searchdata = msg.searchdata;

    Users.aggregate([
        { $unwind :'$propertyDetails'},
        { $match : {'propertyDetails.pName': propertyname}},
        { $project : { _id: 0, propertyDetails: 1, email: 1 } }
        ],
        function(err,result){
            if(err){
                console.log("\nSome error occured in the query ");
            }
            else{

                Users.updateOne(
                    // { email: req.session.emailT },
                    { email: setEmail },
                    {
                        $push: {
                            bookedPropertyDetails: {
                                pCountry: result[0].propertyDetails.pCountry,
                                pAddress: result[0].propertyDetails.pAddress,
                                pCity: result[0].propertyDetails.pCity,
                                pState: result[0].propertyDetails.pState,
                                pZipcode: result[0].propertyDetails.pZipcode,
                                pName: result[0].propertyDetails.pName,
                                pDescription: result[0].propertyDetails.pDescription,
                                pType: result[0].propertyDetails.pType,
                                pBedrooms: result[0].propertyDetails.pBedrooms,
                                pBathrooms: result[0].propertyDetails.pBathrooms,
                                pAccomodates: result[0].propertyDetails.pAccomodates,
                                pImageFiles: result[0].propertyDetails.pImageFiles,
                                pPricePerNight: result[0].propertyDetails.pPricePerNight,
                                blockStartDate : searchdata.startDate,
                                blockEndDate : searchdata.endDate,
                                guests : searchdata.guests,
                                pOwner : result[0].email, 
                            }
                        }
                    },
                    { upsert: true },
                    function( err, result1 ) 
                    {
                        if ( err ) {
                            console.log("Some error occured in handle_request of travelerprofile_post.js of kafka-backend");
                            callback(err,"Some error occured"); 
                        }
                        else{
                            // res.writeHead(200,{
                            //     'Content-Type' : 'text/plain'
                            // })
                            console.log("\n--------------- Success ---------------");
                            console.log("Booking data for this traveler added to his/her database"); 
                            
                            Users.updateOne(
                                { $and : [{email : result[0].email},{'propertyDetails.pName': result[0].propertyDetails.pName}] },
                                {
                                    $push: {
                                        'propertyDetails.$.bookingInfo': {
                                                    travelerEmail : setEmail,
                                                    bookedStartDate : searchdata.startDate,
                                                    bookedEndDate : searchdata.endDate
                                        }
                                    }
                                },
                                { upsert: true },
                                function( err1, result ) 
                                {
                                    if ( err1 ) {
                                        console.log("\nPrinting err1 : "+err1);
                                        console.log(" - - - - - - - Some error occured - - - - - - -");
                                    }
                                    else{
                                        console.log(" - - - - - - - Traveler booking data also added in the owner's database - - - - - - - ");
                                        callback(null,result);
                                    }
                                }
                            );
                            // res.end('Booking data for this user added to the database');
                        }
                    }
                );

            }
        }
    );
}

exports.handle_request = handle_request;