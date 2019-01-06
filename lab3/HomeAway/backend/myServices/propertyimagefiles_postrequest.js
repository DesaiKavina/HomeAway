var express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
var router = express.Router();

router.post('/listproperty/photos/:file(*)', (req, res) => {
    console.log("\nInside the POST handler of listproperty photos file");
    // console.log("Req.params file: "+JSON.stringify(req.params.file));
    // console.log("Req.body : "+JSON.stringify(req.body));
    var file = req.params.file;
    var filenames = file.split(',');
    // console.log(filenames+" and "+filenames.length);
    var filelocation = [];
    for(let k=0;k<filenames.length;k++)
        filelocation.push(path.join(__dirname, '../' + '/uploads',filenames[k]))
    var filelocationstr = filelocation.join();
    res.writeHead(200, {'Content-Type': 'image/jpg' });
    res.end(filelocationstr);
  });

module.exports = router;