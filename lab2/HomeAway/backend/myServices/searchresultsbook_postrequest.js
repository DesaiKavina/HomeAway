var express = require('express');
var app = express();
var router = express.Router();

var kafka = require('../kafka/client');

router.post('/searchresult/bookpropertyname/:email', function(req,res){
    console.log("\nInside POST handler of search result page to book a property");
    console.log(" ================== The set email id is : "+req.params.email+" ======================");
    var propertyname = req.body.bookpropertyname;
    // console.log("Getting the property name from frontend : "+propertyname);
    var searchdata = app.get('travelerSearchData');
    // console.log("\nThe search query fired by the traveler was");
    // console.log(JSON.stringify(searchdata));

    req.body.propertyname = propertyname
    req.body.searchdata = searchdata
    req.body.setEmail = req.params.email

    console.log("\nPrinting req.body here -- \n"+JSON.stringify(req.body));

    kafka.make_request('bookproperty_post',req.body, function(err,results){
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
            res.end('Booking data for this user added to the database');
            res.end('Success');
        }    
    });
});

module.exports = router;