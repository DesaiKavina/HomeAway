var express = require('express');
var app = express();
const path = require('path');
const fs = require('fs');
var kafka = require('../kafka/client');
var router = express.Router();

router.post('/homepage/data/:email', function(req,res){
    console.log("\nInside post request from homepage for property search");
    console.log(" ================== The set email id is : "+req.params.email+" ======================");
    // console.log("Data obtained from frontend");
    // console.log(JSON.stringify(req.body));
    app.set('travelerSearchData', req.body);
    var parsedstart = Date.parse(req.body.startDate);
    var parsedend = Date.parse(req.body.endDate);

    var newarr = [];

    req.body.parsedstart = parsedstart
    req.body.parsedend = parsedend
    req.body.setEmail = req.params.email

    kafka.make_request('homepage_post',req.body, function(err,results){
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
            app.set('result_one', results);
            var result_one = results;
            
            res.end('Success');
        }    
    });   
});


router.get('/searchresults', function(req,res){
    console.log("\nInside GET method of search results"); 
    var res_one = app.get('result_one');

    if(res_one.length>0)
    {
        for(let i=0;i<res_one.length;i++)
        {
            if(res_one[i].pImageFiles!=null && res_one[i].pImageFiles!=undefined)
            {
                var img = [];
                var base64 = [];
                var base64str = "";
                var imagearr = res_one[i].pImageFiles.split(',');
                for(let k=0;k<imagearr.length;k++)
                {
                    img.push(fs.readFileSync(imagearr[k]))
                    base64.push(new Buffer(img[k]).toString('base64'))
                }

                base64str = base64.join();
                res_one[i].pImageFiles = base64str
            }
        }
    }

    var limitedarr = []
    var final_length = 0
    // if()
    // for(let i=)
    res.end(JSON.stringify(res_one));
});


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