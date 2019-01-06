var express = require('express');
var router = express.Router();

var kafka = require('../kafka/client');

var jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
var config = require('../config/settings');

router.post('/travelerlogin',function(req,res){
    
    console.log("\nInside Traveler login Post Request in the backed");;

        kafka.make_request('travelerlogin_post',req.body, function(err,results){
            console.log('in result');
            console.log("Results received back from the kafka backend ...............");
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
                    console.log("Inside else");

                    let travelerEmail = {email : results.email}
                    var token = jwt.sign(travelerEmail, config.secret, {
                        expiresIn: 10080 // in seconds
                    });

                    var newvaliduser = {
                        'firstname' : results.firstname,
                        'lastname' : results.lastname,
                        'email' : results.email,
                        'password' : results.password,
                        'userflag' : results.userflag,
                        'token' : "JWT "+token 
                    }

                    res.cookie('cookieT',"traveler",{maxAge: 1800000, httpOnly: false, path : '/'});
                    // req.session.emailT = results.email;

                    res.end(JSON.stringify(newvaliduser));
    
                }    
        });
});

module.exports = router;