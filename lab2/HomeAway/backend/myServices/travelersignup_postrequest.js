var kafka = require('../kafka/client');
var express = require('express');
var router = express.Router();

router.post('/travelersignup',function(req,res){

    console.log("\nInside Traveler signup Request Handler");

    kafka.make_request('travelersignup_post',req.body, function(err,results){
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