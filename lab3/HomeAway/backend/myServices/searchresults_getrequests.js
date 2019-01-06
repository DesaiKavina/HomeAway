var express = require('express');
var app = express();
var router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
var kafka = require('../kafka/client');

router.get('/searchresults',function(req,res){
    console.log("\nInside GET method of search results"); 
    var res_one = app.get('result_one');

    console.log("*****************************************************")
    console.log("Printing the res_one in searchresults_getrequests");
    console.log(JSON.stringify(res_one));

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
    res.end(JSON.stringify(res_one));
});

module.exports = router;