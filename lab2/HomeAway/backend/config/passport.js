'use strict';
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
// var db = require('../app/db');
var {Users} = require('../models/userinfo');
var config = require('./settings');

// Setup work and export for the JWT passport strategy
module.exports = function (passport) {
    var opts = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("jwt"),
        secretOrKey: config.secret
    };
    passport.use(new JwtStrategy(opts, function (jwt_payload, callback) {
        // console.log("\n___________________ jwt_payload.email ________________");
        // console.log(jwt_payload.email);
        Users.findOne(
            {email: jwt_payload.email}, 
            function (err,result) {
                if(err){
                    return callback(err, false);
                }
                else{
                    var user = result;  
                    delete user.password;
                    callback(null, user);
                }
            }
        );  
    }));
};
