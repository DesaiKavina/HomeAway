var express = require('express');
var app = express();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
var kafka = require('../kafka/client');
var router = express.Router();

router.get('/listproperty/ownerdashboard/image/:email', function(req,res){
    console.log("\nInside Owner Dashboard Image Get Handler");
    console.log("\n================== The set email id is : "+req.params.email+" ======================");

    var setEmail = req.params.email

    req.body.setEmail = setEmail

    kafka.make_request('ownerdashboardimages_get',req.body, function(err,results){
        console.log('in result');
        console.log("Results received back from the kafka backend ...............");
        console.log(results);
        console.log(typeof(results));
        if (err) {
            console.log("Error in getting owner's property details");
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
            console.log("\n--------- Extracted owner property data from the mongoDB collection ----------");
            res.writeHead(200,{
                'Content-Type' : 'text/plain'
            })

            var result1 = [];
            for(let j=0; j<results[0].propertyDetails.length; j++)
            {
                result1.push({"imageFiles": results[0].propertyDetails[j].pImageFiles});
            }
            // console.log("\nPrinting the result made ");
            // console.log(JSON.stringify(result1)+"\n");
            for(let i=0;i<result1.length;i++)
            {
                if(result1[i].imageFiles!="0")
                {
                    var img = [];
                    var base64 = [];
                    var base64str = "";
                    var imagearr = result1[i].imageFiles.split(',');
                    for(let k=0;k<imagearr.length;k++)
                    {
                        img.push(fs.readFileSync(imagearr[k]))
                        base64.push(new Buffer(img[k]).toString('base64'))
                    }
                    base64str = base64.join();
                    result1[i].imageFiles = base64str
                }
            }

            res.end(JSON.stringify(result1))
        }    
    });

    // Users.find(
    //     { email: req.params.email },
    //     { propertyDetails: 1, _id: 0 },
    //     function (err, result) {
    //         if (err) {
    //             console.log("Error in getting owner's property details");
    //             res.writeHead(400,{
    //                 'Content-Type' : 'text/plain'
    //             })
    //             res.end("Error while extracting data from database");
    //         } 
    //         else {
    //             res.writeHead(200,{
    //                 'Content-Type' : 'text/plain'
    //             })
    //             console.log("--------- Extracted owner property images from the mongoDB collection ----------");
                // var result1 = [];
                // for(let j=0; j<result[0].propertyDetails.length; j++)
                // {
                //     result1.push({"imageFiles": result[0].propertyDetails[j].pImageFiles});
                // }
                // // console.log("\nPrinting the result made ");
                // // console.log(JSON.stringify(result1)+"\n");
                // for(let i=0;i<result1.length;i++)
                // {
                //     if(result1[i].imageFiles!="0")
                //     {
                //         // console.log(i);
                //         var img = [];
                //         var base64 = [];
                //         var base64str = "";
                //         var imagearr = result1[i].imageFiles.split(',');
                //         for(let k=0;k<imagearr.length;k++)
                //         {
                //             // console.log(imagearr[k])
                //             img.push(fs.readFileSync(imagearr[k]))
                //             base64.push(new Buffer(img[k]).toString('base64'))
                //         }
                //         // console.log("Img array length : "+img.length);
                //         // console.log("base64 array length : "+base64.length);
                //         base64str = base64.join();
                //         result1[i].imageFiles = base64str
                //     }
                // }
    //             res.end(JSON.stringify(result1))
    //         }
    //     }
    // );
});

module.exports = router;