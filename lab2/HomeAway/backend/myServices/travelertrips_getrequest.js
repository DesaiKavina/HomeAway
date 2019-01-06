var express = require('express');
var app = express();
var kafka = require('../kafka/client');
var router = express.Router();

router.get('/travelertrips/:email', function(req,res){

    console.log("\nInside traveler trips GET request");
    console.log(" ================== The set email id is : "+req.params.email+" ======================");
    var setEmail = req.params.email;

    req.body.setEmail = setEmail

    kafka.make_request('travelertrips_get',req.body, function(err,results){
        // console.log('in result');
        console.log("Results received back from the kafka backend ...............");
        console.log(results);
        console.log(typeof(results));
        if(typeof(results)=='string')
        {
            res.writeHead(400,{
                'Content-Type' : 'text/plain'
            })
            res.end("Error while fetching data from the database");
        }
        else if (err){
            console.log("Some error occured while fetching traveler profile image post data from kafa backend");
            res.writeHead(400,{
                'Content-Type' : 'text/plain'
            })
            res.end("Error while fetching data from the database");
        }
        else
        {
            res.writeHead(200,{
                'Content-Type' : 'text/plain'
            })
            console.log('Success');
            res.end(JSON.stringify(results));
        }    
    });

    // Users.aggregate([
    //     // { email : setEmail},
    //     { $unwind :'$bookedPropertyDetails'},
    //     { $match : {'email': setEmail}},
    //     { $project : { _id: 0, bookedPropertyDetails: 1, email: 1 } }
    //     ],
    //     function(err,resultNew){
    //         if(err){
    //             console.log("\n ----- Some error occured in the query ------");
    //             res.writeHead(400,{
    //                 'Content-Type' : 'text/plain'
    //             })
    //             res.end("Error while extracting booked trips data");
    //         }
    //         else{
    //             res.writeHead(200,{
    //                 'Content-Type' : 'text/plain'
    //             })
    //             console.log("\n ----- Proper query execution -------");
    //             // console.log("\nPrinting the result of the query");
    //             var newresult = [];
    //             // console.log(JSON.stringify(resultNew));
    //             for(let i=0;i<resultNew.length; i++){
    //                 newresult.push(resultNew[i].bookedPropertyDetails)
    //             }
    //             // console.log(JSON.stringify(newresult)+"\n");
    //             res.end(JSON.stringify(newresult));
    //         }
    //     }
    // );
});

module.exports = router;