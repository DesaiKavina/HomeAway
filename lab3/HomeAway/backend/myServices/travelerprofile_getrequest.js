var express = require('express');
var router = express.Router();
var app = express();
const path = require('path');
const fs = require('fs');
const multer = require('multer');
var kafka = require('../kafka/client');

// var b = require('../')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, '../uploads');
    },
    filename: (req, file, cb) => {

    //   const newFilename = `test${path.extname(file.originalname)}`;
    const newFilename = file.originalname;
      cb(null, newFilename);
    },
  });

const upload = multer({ storage : storage }).array('selectedFile',5);

// app.use(express.static(__dirname + '/public')); 

// app.use(express.static( __dirname + '/../public'));

router.get('/travelerprofile/:email', function(req,res){
    console.log("\nInside Traveler Profile Get Handler");
    console.log(" ================== The set email id is : "+req.params.email+" ======================");

    req.body.setEmail = req.params.email

    kafka.make_request('travelerprofile_get',req.body, function(err,results){
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
            var filename = results.profileImage;
            if(filename==undefined){
                console.log("Profile image not yet set");
                res.writeHead(200,{
                    'Content-Type' : 'text/plain'
                })
                res.end(JSON.stringify(results));
            }
            else {
                console.log("Found profile image in the database");
                console.log("Profileimage from the database : "+results.profileImage);
                var fileLocation = path.join(__dirname, '../' + '/uploads',filename);
                console.log("\nFile location being set is : ");
                console.log(fileLocation);
                var img = fs.readFileSync(fileLocation);
                var base64img = new Buffer(img).toString('base64');
                results.profileImage = base64img;
                console.log("Type of result is : "+typeof(results));
                // console.log(JSON.stringify(result));
                res.writeHead(200,{
                    'Content-Type' : 'text/plain'
                })
                res.end(JSON.stringify(results));
            }
        }    
    });  
});

module.exports = router;