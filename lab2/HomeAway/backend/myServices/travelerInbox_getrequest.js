var express = require('express');
var app = express();

var kafka = require('../kafka/client');
var router = express.Router();

router.get('/travelerInbox/:email', function(req,res){
    console.log("\nInside Owner Inbox Get Handler");
    console.log("\n================== The set email id is : "+req.params.email+" ======================");

    var setEmail = req.params.email

    req.body.setEmail = setEmail

    kafka.make_request('travelerinbox_get',req.body, function(err,results){
        // console.log('in result');
        console.log("Results received back from the kafka backend ...............");
        console.log(results);
        console.log(typeof(results));
        if (err) {
            console.log("Error in getting owner's inbox details");
            res.writeHead(400,{
                'Content-Type' : 'text/plain'
            })
            res.end("Error while extracting data from database");
        }
        else if(typeof(results)=='string')
        {
            console.log("Some error occured");
            res.writeHead(400,{
                'Content-Type' : 'text/plain'
            })
            res.end("Some error occured");
        }
        else
        {
            console.log("\n--------- Extracted traveler inbox data from the mongoDB collection ----------");
            res.writeHead(200,{
                'Content-Type' : 'text/plain'
            })
            res.end(JSON.stringify(results));
        }    
    });
});

module.exports = router;