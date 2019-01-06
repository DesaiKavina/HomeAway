var express = require('express');
var app = express();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
var router = express.Router();

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

router.post('/listproperty/photos', (req, res) => {
    console.log("\nInside post method of list property for uploading images")
    // console.log("Req file: ",req.file);
    // console.log("Res file: ",res.file);
    // console.log("Req body : ");
    // console.log(JSON.stringify(req.body));
    // console.log(req.body.fileName);
    upload(req,res,function(err) 
    {
        console.log("Inside the upload method ");
        if(err) {
            console.log("Error uploading images");
            return res.end("Error uploading images");
        }
    res.end("Property images uploaded successfully");
    });
});

module.exports = router;