var express = require('express');
var router = express.Router();
var kafka = require('../kafka/client');

const multer = require('multer');
const path = require('path');
const fs = require('fs');

// var abc = require('../myServices/uploads')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './uploads');
    },
    filename: (req, file, cb) => {

    //   const newFilename = `test${path.extname(file.originalname)}`;
    const newFilename = file.originalname;
      cb(null, newFilename);
    },
  });

const upload = multer({ storage : storage }).array('selectedFile',5);


router.post('/travelerprofile/imageupload/:email', (req, res) => {
    console.log("Inside traveler profile image upload post request");
    console.log(" ================== The set email id is : "+req.params.email+" ======================");

    
    
    upload(req,res,function(err) 
    {
        console.log("Insid upload method");
        console.log("\nPrinting req.files");
        console.log(JSON.stringify(req.files));
        var filename = req.files[0].originalname;
        console.log("Uploaded filename : "+filename);
        if(err) {
            console.log("Error uploading profile image");
            return res.end("Error uploading profile image");
        }
        else{

            req.body.setEmail = req.params.email
            req.body.filename = filename
            kafka.make_request('travelerprofileimage_post',req.body, function(err,results){
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
                    res.end("Traveler profile picture updated successfully");
                }    
            });        
        }
    });
});

module.exports = router;