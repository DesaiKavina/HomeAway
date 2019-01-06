var {Users} = require('../models/userinfo');
var {mongoose} = require('../db/mongoose');

function handle_request(msg, callback){
    var res = {};
    console.log("\nIn handle request for traveler profile post:\n"+ JSON.stringify(msg));

    var setEmail = msg.setEmail
    var counter = 0;

    Users.aggregate([
        { $unwind :'$propertyDetails'},
        { $match : {'propertyDetails.pCity': msg.location , 'propertyDetails.pAccomodates': { $gte : msg.guests} }},
        { $project : { _id: 0, propertyDetails: 1, email: 1 } }
        ],
        function(err,result){
            if(err){
                console.log("Some error occured in handle_request of homepage_post.js of kafka-backend");
                callback(err,"Some error occured");
            }
            else{
                console.log("\nSuccessful query execution for getting appropriate search results");
                
                console.log("After first query, number of properties found are : "+result.length);

                var myarr = [];
                var flag = false;
                for (let x=0; x<result.length; x++)
                {
                    var obtainedStart = Date.parse(result[x].propertyDetails.pAvailableStart);
                    var obtainedEnd = Date.parse(result[x].propertyDetails.pAvailableEnd);

                    if(obtainedStart<=msg.parsedstart && obtainedEnd>=msg.parsedend)
                    {

                        Users.aggregate([
                            { $unwind :'$bookedPropertyDetails'},
                            { $match : {'bookedPropertyDetails.pName':  result[x].propertyDetails.pName}},
                            { $project : { _id: 0, bookedPropertyDetails: 1 } }
                            ],
                            function(err,myResult){
                                if(err){
                                    console.log("Query for fetching data for blocked dates");
                                    // res.writeHead(400,{
                                    //     'Content-Type' : 'text/plain'
                                    // })
                                }
                                else{
                                    console.log(" Extracted data for checking the block dates ");

                                    if(myResult.length > 0)
                                    {
                                        var blockstartarr = [];
                                        var blockendarr = [];
                                        for(let j=0; j<myResult.length; j++)
                                        {
                                           blockstartarr.push(Date.parse(myResult[j].bookedPropertyDetails.blockStartDate));
                                           blockendarr.push(Date.parse(myResult[j].bookedPropertyDetails.blockEndDate)); 
                                        }

                                        for(let k=0;k<blockstartarr.length;k++)
                                        {
                                            console.log("k = "+k);
                                            if( (msg.parsedstart<blockstartarr[k] && msg.parsedend<blockstartarr[k]) || (msg.parsedstart>blockendarr[k] && msg.parsedend>blockendarr[k]) )
                                            {
                                                console.log("Setting the flag to true")
                                                flag = true;
                                            }
                                            else
                                            {
                                                console.log("Inside the complicated else condition");
                                                flag = false;
                                                break;
                                            }
                                        }
                                    }
                                    else
                                    {
                                        console.log("This property has not been booked yet");
                                        flag = true
                                    }
                                    if(flag==true){
                                        console.log(" ____________________ Flag is true for "+result[x].propertyDetails.pName+"________________");
                                        myarr.push(result[x].propertyDetails)
                                        myarr[counter].pOwner = result[x].email
                                        counter++;
                                        if(x==result.length-1)
                                        {
                                            console.log("\nPrinting the myarr object ........................................");
                                            console.log(JSON.stringify(myarr));
                                            callback(null,myarr);
                                        }
                                    }
                                    // else
                                    // {
                                    //     callback(null,myarr);
                                    // }
                                }
                            }
                        );
                    }
                }
                console.log("Sending the homepage data from kafka backend");
                // callback(null,myarr);
                // app.set('result_one', myarr);
                // res.end('Success');
            }
        }
        );

}

exports.handle_request = handle_request;