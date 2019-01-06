var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');

const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
var router = express.Router();
var kafka = require('../kafka/client');

router.post('/listproperty/price/:email', function(req,res){
    
    console.log("\nInside Owner post property price details POST Request");
    console.log("\n================== The set email id is : "+req.params.email+" ======================");
    var setEmail = req.params.email;

    req.body.setEmail = setEmail

    kafka.make_request('propertyprice_post',req.body, function(err,results){
        console.log('in result');
        console.log("Results received back from the kafka backend ...............");
        console.log(results);
        console.log(typeof(results));
        if(typeof(results)=='string')
        {
            console.log("Some error occured in the update query for owner property details");
            res.writeHead(400,{
                'Content-Type' : 'text/plain'
            })
            res.end("Error while adding property information");
        }
        else if (err){
            console.log("Some error occured while getting data from kafa backend");
            res.writeHead(400,{
                'Content-Type' : 'text/plain'
            })
            res.end("Error while fetching data from the database");
        }
        else
        {
            console.log("Owner property details added successfully in the database");
            res.writeHead(200,{
                'Content-Type' : 'text/plain'
            })
            res.end('Property details added successfully');
        }    
    });

        // Users.update(
        //     { email: setEmail },
        //     {
        //         $push: {
        //             propertyDetails: {
        //                 pCountry: req.body.country,
        //                 pAddress: req.body.address,
        //                 pCity: req.body.city,
        //                 pState: req.body.state,
        //                 pZipcode: req.body.zipcode,
        //                 pName: req.body.propertyname,
        //                 pDescription: req.body.propertydesc,
        //                 pType: req.body.propertytype,
        //                 pBedrooms: req.body.bedrooms,
        //                 pBathrooms: req.body.bathrooms,
        //                 pAccomodates: req.body.accomodates,
        //                 pImageFiles: req.body.imagefiles,
        //                 pAvailableStart: req.body.availableStart,
        //                 pAvailableEnd: req.body.availableEnd,
        //                 pPricePerNight: req.body.pricePerNight
        //             }
        //         }
        //     },
        //     { upsert: true },
        //     function( err, result ) 
        //     {
        //         if ( err ) {
        //             console.log("Some error occured in the update query for owner property details");
        //             res.writeHead(400,{
        //                 'Content-Type' : 'text/plain'
        //             })
        //             res.end("Error while adding property information");
        //         }
        //         else{
        //             console.log("Owner property details added successfully in the database");
        //             res.writeHead(200,{
        //                 'Content-Type' : 'text/plain'
        //             })
        //             res.end('Property details added successfully');
        //         }
        //     }
        // );
});

module.exports = router;