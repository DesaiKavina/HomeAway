var express = require('express');
var router = express.Router();
var kafka = require('../kafka/client');

router.post('/travelerprofile/:email', function(req,res){
    
    console.log("\nInside Traveler profile Post Request");

    console.log("\n================== The set email id is : "+req.params.email+" ======================");

    req.body.setEmail = req.params.email
    
    kafka.make_request('travelerprofile_post',req.body, function(err,results){
        console.log('in result');
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
            console.log("Some error occured while fetching traveler signup post data from kafa backend");
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
            res.end("Traveler added successfully");
        }    
    });
});

module.exports = router;