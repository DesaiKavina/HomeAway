var express = require('express');
var router = express.Router();

var kafka = require('../kafka/client');


router.post('/replyToTraveler/:email',function(req,res){
    
    console.log("\nInside owner reply to traveler post request\n");
    console.log(" ================== The set email id is : "+req.params.email+" ======================");
    req.body.setEmail = req.params.email
    // console.log("\nPrinting req.body here : \n"+JSON.stringify(req.body));

    kafka.make_request('ownerinbox_post',req.body, function(err,results){
        // console.log('in result');
        console.log("\nResults received back from the kafka backend ...............");
        console.log(results);
        if(typeof(results)=='string')
        {
            res.writeHead(400,{
                'Content-Type' : 'text/plain'
            })
            res.end("Some error occured");
        }
        else if (err){
            console.log("Inside err");
            res.writeHead(400,{
                'Content-Type' : 'text/plain'
            })
            res.end("Some error occured");
        }
        else{
                console.log("No error occured in the query execution");
                res.writeHead(200,{
                    'Content-Type' : 'text/plain'
                })
                res.end("Success");
            }    
    });
});

module.exports = router;