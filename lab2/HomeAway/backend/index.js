var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var cors = require('cors');
// var morgan = require('morgan');
var passport = require('passport');
var config = require('./config/settings');
var jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
var kafka = require('./kafka/client');

var requireAuth = passport.authenticate('jwt', {session: false});
//////////////////////////////////////////////////////////////////////////////////////////////////
var travelerlogin_request = require('./myServices/travelerlogin_postrequest');
var travelersignup_request = require('./myServices/travelersignup_postrequest');
var travelerprofile_data_request = require('./myServices/travelerprofiledata_postrequest');
var travelerprofile_image_request = require('./myServices/travelerprofileimage_postrequest');
var travelerprofile_get_request = require('./myServices/travelerprofile_getrequest');
var homepagedata_request = require('./myServices/homepage_search_postrequest');
var traveler_askOwnerQuestion = require('./myServices/askQuestion_postrequest');
var travelertrips_request = require('./myServices/travelertrips_getrequest');
var travelerInbox_request = require('./myServices/travelerInbox_getrequest');

var ownerlogin_request = require('./myServices/ownerlogin_postrequest');
var ownersignup_request = require('./myServices/ownersignup_postrequest');
var ownerproperty_photo_request = require('./myServices/propertyphotos_postrequest');
var ownerproperty_imagefiles_request = require('./myServices/propertyimagefiles_postrequest')
var ownerproperty_price_request = require('./myServices/propertyprice_postrequest')
var ownerdashboard_data_request = require('./myServices/ownerdashboarddata_getrequest')
var ownerdashboard_images_request = require('./myServices/ownerdashboardimages_getrequest')
var ownerInbox_request = require('./myServices/ownerInbox_getrequest')
var ownerInbox_replyrequest = require('./myServices/ownerInbox_postrequest')
// var searchresults_request = require('./myServices/searchresults_getrequests');
// var searchresult_book_request = require('./myServices/searchresultsbook_postrequest');
///////////////////////////////////////////////////////////////////////////////////////////////////

app.set('view engine','ejs');
app.set('views','./views');

app.use(express.static(__dirname + '/public')); 

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

app.use(passport.initialize());

require('./config/passport')(passport);

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

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
  }));

var {Users} = require('./models/userinfo');
var {mongoose} = require('./db/mongoose');

app.use(session({
    secret              : 'cmpe273_kafka_passport_mongo',
    resave              : false, 
    saveUninitialized   : false, 
    duration            : 60 * 60 * 1000,    // Overall duration of Session : 30 minutes : 1800 seconds
    activeDuration      : 5 * 60 * 1000
}));

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
    res.setHeader('Cache-Control', 'no-cache');
    next();
  });


app.post('/travelerlogin',travelerlogin_request);

// app.post('/travelerlogin',function(req,res){
    
//     console.log("\nInside Traveler login Post Request in the backed");;

//         kafka.make_request('travelerlogin_post',req.body, function(err,results){
//             console.log('in result');
//             console.log("Results received back from the kafka backend ...............");
//             console.log(results);
//             if (err){
//                 console.log("Inside err");
//                 res.writeHead(400,{
//                     'Content-Type' : 'text/plain'
//                 })
//                 res.end("Error while fetching data from the database");
//             }
//             else{
//                     console.log("Inside else");

//                     let travelerEmail = {email : results.email}
//                     var token = jwt.sign(travelerEmail, config.secret, {
//                         expiresIn: 10080 // in seconds
//                     });

//                     var newvaliduser = {
//                         'firstname' : results.firstname,
//                         'lastname' : results.lastname,
//                         'email' : results.email,
//                         'password' : results.password,
//                         'userflag' : results.userflag,
//                         'token' : "JWT "+token 
//                     }

//                     res.cookie('cookieT',"traveler",{maxAge: 1800000, httpOnly: false, path : '/'});
//                     // req.session.emailT = results.email;

//                     res.end(JSON.stringify(newvaliduser));
    
//                 }    
//         });

//         // Users.findOne({
//         //     email:req.body.email
//         // }, function(err,validuser){
//         //     if (err) {
//         //         res.code = "400";
//         //         res.value = "The email and password you entered doesnot match";
//         //         // console.log(res.value);
//         //         res.sendStatus(400).end("Invalid Credentials"); 
//         //     } 
//         //     // else if(validuser && validuser.password == req.body.password){
//         //     else if(validuser && bcrypt.compareSync(req.body.password, validuser.password)){
//         //         res.code = "200";
//         //         res.value = validuser;
//                 // console.log("The entered email and password matches with the records in the database");

//                 // let travelerEmail = {email : validuser.email}
//                 // var token = jwt.sign(travelerEmail, config.secret, {
//                 //     expiresIn: 10080 // in seconds
//                 // });

//                 // // validuser.token = token;

//                 // var newvaliduser = {
//                 //     'firstname' : validuser.firstname,
//                 //     'lastname' : validuser.lastname,
//                 //     'email' : validuser.email,
//                 //     'password' : validuser.password,
//                 //     'userflag' : validuser.userflag,
//                 //     'token' : "JWT "+token 
//                 // }

//         //         // console.log("\nPrinting new valid user");
//         //         // console.log(newvaliduser);
    
//                 // res.cookie('cookieT',"traveler",{maxAge: 1800000, httpOnly: false, path : '/'});
//                 // req.session.emailT = validuser.email;
//         //         // res.sendStatus(200).end(validuser.firstname);

//         //         res.end(JSON.stringify(newvaliduser));
//         //     }
//         // })
// });

app.post('/travelersignup',travelersignup_request);

// app.post('/travelersignup',function(req,res){

//     console.log("\nInside Traveler signup Request Handler");

//     kafka.make_request('travelersignup_post',req.body, function(err,results){
//         console.log('in result');
//         console.log("Results received back from the kafka backend ...............");
//         console.log(results);
//         console.log(typeof(results));
//         if(typeof(results)=='string')
//         {
//             res.writeHead(400,{
//                 'Content-Type' : 'text/plain'
//             })
//             res.end("Error while fetching data from the database");
//         }
//         else if (err){
//             console.log("Some error occured while fetching traveler signup post data from kafa backend");
//             res.writeHead(400,{
//                 'Content-Type' : 'text/plain'
//             })
//             res.end("Error while fetching data from the database");
//         }
//         else
//         {
//             res.writeHead(200,{
//                 'Content-Type' : 'text/plain'
//             })
//             res.end("Traveler added successfully");
//         }    
//     });


//     // var salt = bcrypt.genSaltSync(10);
//     // var hash = bcrypt.hashSync(req.body.password, salt);

//     // var newTraveler = new Users({
//     //     firstname: req.body.firstname,
//     //     lastname: req.body.lastname,
//     //     email: req.body.email,
//     //     // password: req.body.password,
//     //     password : hash,
//     //     userflag: 'T'
//     // })

//     // newTraveler.save().then((newTraveler)=>{
//     //     console.log("New traveler account created !!");
//     //     console.log(newTraveler)
//     //     var message = "Traveler added successfully";
//     //     res.sendStatus(200).end(message);
//     // },(err)=>{
//     //     console.log("Error While signing up traveler");
//     //     var message = "Error While signing up traveler";
//     //     res.sendStatus(400).end(message);
//     // })
// });

app.post('/travelerprofile/:email', requireAuth, travelerprofile_data_request);

// app.post('/travelerprofile/:email', requireAuth, function(req,res){
    
//     console.log("\nInside Traveler profile Post Request");

//     console.log("\n================== The set email id is : "+req.params.email+" ======================");

//     req.body.setEmail = req.params.email
    
//     kafka.make_request('travelerprofile_post',req.body, function(err,results){
//         console.log('in result');
//         console.log("Results received back from the kafka backend ...............");
//         console.log(results);
//         console.log(typeof(results));
//         if(typeof(results)=='string')
//         {
//             res.writeHead(400,{
//                 'Content-Type' : 'text/plain'
//             })
//             res.end("Error while fetching data from the database");
//         }
//         else if (err){
//             console.log("Some error occured while fetching traveler signup post data from kafa backend");
//             res.writeHead(400,{
//                 'Content-Type' : 'text/plain'
//             })
//             res.end("Error while fetching data from the database");
//         }
//         else
//         {
//             res.writeHead(200,{
//                 'Content-Type' : 'text/plain'
//             })
//             res.end("Traveler added successfully");
//         }    
//     });

//     // Users.update(
//     //     { email: req.params.email },
//     //     {
//     //         firstname: req.body.firstname,
//     //         lastname: req.body.lastname,
//     //         aboutme: req.body.aboutme,
//     //         city: req.body.city,
//     //         country: req.body.country,
//     //         company: req.body.company,
//     //         school: req.body.school,
//     //         hometown: req.body.hometown,
//     //         languages: req.body.languages,
//     //         phoneno: req.body.phoneno,
//     //         gender: req.body.gender,
//     //     },
//     //     { upsert: true },
//     //     function( err, result ) 
//     //     {
//     //         if ( err ) {
//     //             console.log("Some error occured in the update query for traveler profile");
//     //             res.writeHead(400,{
//     //                 'Content-Type' : 'text/plain'
//     //             })
//     //             res.end("Could Not Get Connection Object");
//     //         }
//     //         else{
//     //             console.log("Traveler info updated successfully");
//     //             res.writeHead(200,{
//     //                 'Content-Type' : 'text/plain'
//     //             })
//     //             res.end('Traveler info updated successfully');
//     //         }
//     //     }
//     //     );
// });

app.post('/travelerprofile/imageupload/:email', requireAuth, travelerprofile_image_request);

// app.post('/travelerprofile/imageupload/:email', requireAuth, (req, res) => {
//     console.log("Inside traveler profile image upload post request");
//     console.log(" ================== The set email id is : "+req.params.email+" ======================");

    
//     // console.log("The current set email ID is : "+req.session.emailT);
//     upload(req,res,function(err) 
//     {
//         console.log("Insid upload method");
//         // console.log("Req.file : "+JSON.stringify(req.files));
//         var filename = req.files[0].originalname;
//         console.log("Uploaded filename : "+filename);
//         if(err) {
//             console.log("Error uploading profile image");
//             return res.end("Error uploading profile image");
//         }
//         else{

//             req.body.setEmail = req.params.email
//             req.body.filename = filename
//             kafka.make_request('travelerprofileimage_post',req.body, function(err,results){
//                 // console.log('in result');
//                 console.log("Results received back from the kafka backend ...............");
//                 console.log(results);
//                 console.log(typeof(results));
//                 if(typeof(results)=='string')
//                 {
//                     res.writeHead(400,{
//                         'Content-Type' : 'text/plain'
//                     })
//                     res.end("Error while fetching data from the database");
//                 }
//                 else if (err){
//                     console.log("Some error occured while fetching traveler profile image post data from kafa backend");
//                     res.writeHead(400,{
//                         'Content-Type' : 'text/plain'
//                     })
//                     res.end("Error while fetching data from the database");
//                 }
//                 else
//                 {
//                     res.writeHead(200,{
//                         'Content-Type' : 'text/plain'
//                     })
//                     res.end("Traveler profile picture updated successfully");
//                 }    
//             });        

//             // Users.update(
//             //     // { email: req.session.emailT },
//             //     { email: req.params.email },
//             //     {
//             //         profileImage: filename
//             //     },
//             //     { upsert: true },
//             //     function( err, result ) 
//             //     {
//             //         if ( err ) {
//             //             console.log("Some error occured in the profile picture update query for traveler profile");
//             //                 res.writeHead(400,{
//             //                     'Content-Type' : 'text/plain'
//             //                 })
//             //                 res.end("Error updating traveler profile information");
//             //         }
//             //         else{
//             //             res.writeHead(200,{
//             //                 'Content-Type' : 'text/plain'
//             //             })
//             //             console.log("Traveler profile pic  updated successfully");
//             //             res.end('Traveler profile pic updated successfully');
//             //         }
//             //     }
//             //     );
//         }
//     // res.end("Profile Image uploaded successfully");
//     });
// });

app.get('/travelerprofile/:email', requireAuth, travelerprofile_get_request);

// app.get('/travelerprofile/:email', requireAuth, function(req,res){
//     console.log("\nInside Traveler Profile Get Handler");
//     console.log(" ================== The set email id is : "+req.params.email+" ======================");


//     req.body.setEmail = req.params.email

//     kafka.make_request('travelerprofile_get',req.body, function(err,results){
//         console.log("Results received back from the kafka backend ...............");
//         console.log(results);
//         console.log(typeof(results));
//         if(typeof(results)=='string')
//         {
//             res.writeHead(400,{
//                 'Content-Type' : 'text/plain'
//             })
//             res.end("Error while fetching data from the database");
//         }
//         else if (err){
//             console.log("Some error occured while fetching traveler profile image post data from kafa backend");
//             res.writeHead(400,{
//                 'Content-Type' : 'text/plain'
//             })
//             res.end("Error while fetching data from the database");
//         }
//         else
//         {
//             var filename = results.profileImage;
//             if(filename==undefined){
//                 console.log("Profile image not yet set");
//                 res.writeHead(200,{
//                     'Content-Type' : 'text/plain'
//                 })
//                 res.end(JSON.stringify(results));
//             }
//             else {
//                 console.log("Found profile image in the database");
//                 console.log("Profileimage from the database : "+results.profileImage);
//                 var fileLocation = path.join(__dirname + '/uploads',filename);
//                 var img = fs.readFileSync(fileLocation);
//                 var base64img = new Buffer(img).toString('base64');
//                 results.profileImage = base64img;
//                 console.log("Type of result is : "+typeof(results));
//                 // console.log(JSON.stringify(result));
//                 res.writeHead(200,{
//                     'Content-Type' : 'text/plain'
//                 })
//                 res.end(JSON.stringify(results));
//             }
//         }    
//     });  

//     // Users.findOne({
//     //     // email:req.session.emailT
//     //     email:req.params.email
//     // }, function(err,result){
//     //     if (err) {
//     //         console.log("Error extracting traveler data from mongodb");
//     //         res.writeHead(400,{
//     //             'Content-Type' : 'text/plain'
//     //         })
//     //         res.end("Error while extracting data from database");
//     //     } 
//     //     else {
//     //        console.log("Traveler data successfully extracted from mongodb");
//     //     //    console.log("Profile image of the traveler : "+result.profileImage);
//     //     //    console.log(" - - - - - Printing the result - - - - -");
//     //     //    console.log(result);
//             // var filename = result.profileImage;
//             // if(filename==undefined){
//             //     console.log("Profile image not yet set");
//             //     res.writeHead(200,{
//             //         'Content-Type' : 'text/plain'
//             //     })
//             //     res.end(JSON.stringify(result));
//             // }
//             // else {
//             //     console.log("Found profile image in the database");
//             //     console.log("Profileimage from the database : "+result.profileImage);
//             //     var fileLocation = path.join(__dirname + '/uploads',filename);
//             //     var img = fs.readFileSync(fileLocation);
//             //     var base64img = new Buffer(img).toString('base64');
//             //     result.profileImage = base64img;
//             //     console.log("Type of result is : "+typeof(result));
//             //     // console.log(JSON.stringify(result));
//             //     res.writeHead(200,{
//             //         'Content-Type' : 'text/plain'
//             //     })
//             //     res.end(JSON.stringify(result));
//     //         }
//     //     }
//     // })
// });

app.post('/homepage/data/:email', requireAuth, homepagedata_request)

// app.post('/homepage/data/:email', requireAuth, function(req,res){
//     console.log("\nInside post request from homepage for property search");
//     console.log(" ================== The set email id is : "+req.params.email+" ======================");
//     // console.log("Data obtained from frontend");
//     // console.log(JSON.stringify(req.body));
//     app.set('travelerSearchData', req.body);
//     var parsedstart = Date.parse(req.body.startDate);
//     var parsedend = Date.parse(req.body.endDate);

//     var newarr = [];

//     req.body.parsedstart = parsedstart
//     req.body.parsedend = parsedend
//     req.body.setEmail = req.params.email

//     kafka.make_request('homepage_post',req.body, function(err,results){
//         // console.log('in result');
//         console.log("Results received back from the kafka backend ...............");
//         console.log(results);
//         console.log(typeof(results));
//         if(typeof(results)=='string')
//         {
//             res.writeHead(400,{
//                 'Content-Type' : 'text/plain'
//             })
//             res.end("Error while fetching data from the database");
//         }
//         else if (err){
//             console.log("Some error occured while fetching traveler profile image post data from kafa backend");
//             res.writeHead(400,{
//                 'Content-Type' : 'text/plain'
//             })
//             res.end("Error while fetching data from the database");
//         }
//         else
//         {
//             res.writeHead(200,{
//                 'Content-Type' : 'text/plain'
//             })
//             app.set('result_one', results);
//             res.end('Success');
//         }    
//     });   

//     // Users.aggregate([
//     //     { $unwind :'$propertyDetails'},
//     //     { $match : {'propertyDetails.pCity': req.body.location , 'propertyDetails.pAccomodates': { $gte : req.body.guests} }},
//     //     { $project : { _id: 0, propertyDetails: 1 } }
//     //     ],
//     //     function(err,result){
//     //         if(err){
//     //             console.log("Some error occured in the query");
//     //             res.writeHead(400,{
//     //                 'Content-Type' : 'text/plain'
//     //             })
//     //             res.end("Error while fetching data from the database");
//     //         }
//     //         else{

//     //             console.log("\nSuccessful query execution for getting appropriate search results");
//     //             // console.log("\nPrinting the output for search results");
//     //             // console.log(JSON.stringify(result));

//     //             res.writeHead(200,{
//     //                 'Content-Type' : 'text/plain'
//     //             })

//     //             var myarr = [];
//     //             var flag = false;
//     //             for (let x=0; x<result.length; x++)
//     //             {
//     //                 var obtainedStart = Date.parse(result[x].propertyDetails.pAvailableStart);
//     //                 var obtainedEnd = Date.parse(result[x].propertyDetails.pAvailableEnd);

//     //                 if(obtainedStart<=parsedstart && obtainedEnd>=parsedend)
//     //                 {

//     //                     Users.aggregate([
//     //                         { $unwind :'$bookedPropertyDetails'},
//     //                         { $match : {'bookedPropertyDetails.pName':  result[x].propertyDetails.pName}},
//     //                         { $project : { _id: 0, bookedPropertyDetails: 1 } }
//     //                         ],
//     //                         function(err,myResult){
//     //                             if(err){
//     //                                 console.log("Query for fetching data for blocked dates");
//     //                                 res.writeHead(400,{
//     //                                     'Content-Type' : 'text/plain'
//     //                                 })
//     //                             }
//     //                             else{
//     //                                 console.log(" Extracted data for checking the block dates ");
//     //                                 // console.log("\nPrinting the result");
//     //                                 // console.log(myResult);
//     //                                 if(myResult.length > 0)
//     //                                 {
//     //                                     var blockstartarr = [];
//     //                                     var blockendarr = [];
//     //                                     for(let j=0; j<myResult.length; j++)
//     //                                     {
//     //                                        blockstartarr.push(Date.parse(myResult[j].bookedPropertyDetails.blockStartDate));
//     //                                        blockendarr.push(Date.parse(myResult[j].bookedPropertyDetails.blockEndDate)); 
//     //                                     }
//     //                                     // console.log("\nPrinting the blockstart array");
//     //                                     // console.log(blockstartarr);
//     //                                     // console.log("\nPrinting the blockend array");
//     //                                     // console.log(blockendarr);
//     //                                     for(let k=0;k<blockstartarr.length;k++)
//     //                                     {
//     //                                         console.log("k = "+k);
//     //                                         if( (parsedstart<blockstartarr[k] && parsedend<blockstartarr[k]) || (parsedstart>blockendarr[k] && parsedend>blockendarr[k]) )
//     //                                         {
//     //                                             // console.log("Setting the flag to true")
//     //                                             flag = true;
//     //                                         }
//     //                                         else
//     //                                         {
//     //                                             // console.log("Inside the complicated else condition");
//     //                                             flag = false;
//     //                                             break;
//     //                                         }
//     //                                     }
//     //                                 }
//     //                                 else
//     //                                 {
//     //                                     // console.log("This property has not been booked yet");
//     //                                     flag = true
//     //                                 }
//     //                                 if(flag==true){
//     //                                     // console.log(" ____________________ Flag is true for "+result[x].propertyDetails.pName+"________________");
//     //                                     myarr.push(result[x].propertyDetails)
//     //                                 }
//     //                             }
//     //                         }
//     //                     );
//     //                 }
//     //             }
//     //             // console.log("\nPrinting myarr");
//     //             // console.log(JSON.stringify(myarr));
//     //             app.set('result_one', myarr);
//     //             res.end('Success');
//     //         }
//     //     }
//     //     );
// });

// app.get('/searchresults', searchresults_request)
app.get('/searchresults', requireAuth, homepagedata_request)

// app.get('/searchresults', requireAuth,function(req,res){
//     console.log("\nInside GET method of search results"); 
//     var res_one = app.get('result_one');

//     if(res_one.length>0)
//     {
//         for(let i=0;i<res_one.length;i++)
//         {
//             if(res_one[i].pImageFiles!=null && res_one[i].pImageFiles!=undefined)
//             {
//                 var img = [];
//                 var base64 = [];
//                 var base64str = "";
//                 var imagearr = res_one[i].pImageFiles.split(',');
//                 for(let k=0;k<imagearr.length;k++)
//                 {
//                     img.push(fs.readFileSync(imagearr[k]))
//                     base64.push(new Buffer(img[k]).toString('base64'))
//                 }

//                 base64str = base64.join();
//                 res_one[i].pImageFiles = base64str
//             }
//         }
//     }
//     res.end(JSON.stringify(res_one));
// });

// app.post('/searchresult/bookpropertyname/:email', requireAuth, searchresult_book_request)

app.post('/searchresult/bookpropertyname/:email', requireAuth, homepagedata_request)

// app.post('/searchresult/bookpropertyname/:email', requireAuth,function(req,res){
//     console.log("\nInside POST handler of search result page to book a property");
//     console.log(" ================== The set email id is : "+req.params.email+" ======================");
//     var propertyname = req.body.bookpropertyname;
//     // console.log("Getting the property name from frontend : "+propertyname);
//     var searchdata = app.get('travelerSearchData');
//     // console.log("\nThe search query fired by the traveler was");
//     // console.log(JSON.stringify(searchdata));

//     req.body.propertyname = propertyname

//     req.body.searchdata = searchdata
//     req.body.setEmail = req.params.email

//     console.log("\nPrinting req.body here -- \n"+JSON.stringify(req.body));

//     kafka.make_request('bookproperty_post',req.body, function(err,results){
//         // console.log('in result');
//         console.log("Results received back from the kafka backend ...............");
//         console.log(results);
//         console.log(typeof(results));
//         if(typeof(results)=='string')
//         {
//             res.writeHead(400,{
//                 'Content-Type' : 'text/plain'
//             })
//             res.end("Error while fetching data from the database");
//         }
//         else if (err){
//             console.log("Some error occured while fetching traveler profile image post data from kafa backend");
//             res.writeHead(400,{
//                 'Content-Type' : 'text/plain'
//             })
//             res.end("Error while fetching data from the database");
//         }
//         else
//         {
//             res.writeHead(200,{
//                 'Content-Type' : 'text/plain'
//             })
//             res.end('Booking data for this user added to the database');
//             res.end('Success');
//         }    
//     });

//     // Users.aggregate([
//     //     { $unwind :'$propertyDetails'},
//     //     { $match : {'propertyDetails.pName': propertyname}},
//     //     { $project : { _id: 0, propertyDetails: 1, email: 1 } }
//     //     ],
//     //     function(err,result){
//     //         if(err){
//     //             console.log("\nSome error occured in the query ");
//     //         }
//     //         else{
//     //             // console.log("\nOkay!!!! The query executed properly")
//     //             // console.log("\nHey I got property details for the property : "+propertyname)
//     //             // console.log(JSON.stringify(result));

//     //             Users.updateOne(
//     //                 // { email: req.session.emailT },
//     //                 { email: req.params.email },
//     //                 {
//     //                     $push: {
//     //                         bookedPropertyDetails: {
//     //                             pCountry: result[0].propertyDetails.pCountry,
//     //                             pAddress: result[0].propertyDetails.pAddress,
//     //                             pCity: result[0].propertyDetails.pCity,
//     //                             pState: result[0].propertyDetails.pState,
//     //                             pZipcode: result[0].propertyDetails.pZipcode,
//     //                             pName: result[0].propertyDetails.pName,
//     //                             pDescription: result[0].propertyDetails.pDescription,
//     //                             pType: result[0].propertyDetails.pType,
//     //                             pBedrooms: result[0].propertyDetails.pBedrooms,
//     //                             pBathrooms: result[0].propertyDetails.pBathrooms,
//     //                             pAccomodates: result[0].propertyDetails.pAccomodates,
//     //                             pImageFiles: result[0].propertyDetails.pImageFiles,
//     //                             pPricePerNight: result[0].propertyDetails.pPricePerNight,
//     //                             blockStartDate : searchdata.startDate,
//     //                             blockEndDate : searchdata.endDate,
//     //                             guests : searchdata.guests,
//     //                             pOwner : result[0].email, 
//     //                         }
//     //                     }
//     //                 },
//     //                 { upsert: true },
//     //                 function( err, result1 ) 
//     //                 {
//     //                     if ( err ) {
//     //                         console.log("\n--------- Some error occured in the query -----------");
//     //                         // console.log("Some error occured in the update query for owner property details");
//     //                         res.writeHead(400,{
//     //                             'Content-Type' : 'text/plain'
//     //                         })
//     //                         res.end("Error while adding property information");
//     //                     }
//     //                     else{
//     //                         res.writeHead(200,{
//     //                             'Content-Type' : 'text/plain'
//     //                         })
//     //                         console.log("\n--------------- Success ---------------");
//     //                         console.log("Booking data for this traveler added to his/her database"); 
                            
//     //                         Users.updateOne(
//     //                             { $and : [{email : result[0].email},{'propertyDetails.pName': result[0].propertyDetails.pName}] },
//     //                             {
//     //                                 $push: {
//     //                                     'propertyDetails.$.bookingInfo': {
//     //                                                 travelerEmail : req.params.email,
//     //                                                 bookedStartDate : searchdata.startDate,
//     //                                                 bookedEndDate : searchdata.endDate
//     //                                     }
//     //                                 }
//     //                             },
//     //                             { upsert: true },
//     //                             function( err1, result ) 
//     //                             {
//     //                                 if ( err1 ) {
//     //                                     console.log("\nPrinting err1 : "+err1);
//     //                                     console.log(" - - - - - - - Some error occured - - - - - - -");
//     //                                 }
//     //                                 else{
//     //                                     console.log(" - - - - - - - Traveler booking data also added in the owner's database - - - - - - - ");
//     //                                 }
//     //                             }
//     //                         );

//     //                         res.end('Booking data for this user added to the database');
//     //                     }
//     //                 }
//     //             );

//     //         }
//     //     }
//     // );
// });

app.post('/searchresult/askOwnerQuestion/:email', requireAuth, traveler_askOwnerQuestion)

app.get('/travelerInbox/:email', requireAuth, travelerInbox_request)

app.get('/travelertrips/:email', requireAuth, travelertrips_request)

// app.get('/travelertrips/:email', requireAuth, function(req,res){

//     console.log("\nInside traveler trips GET request");
//     console.log(" ================== The set email id is : "+req.params.email+" ======================");
//     var setEmail = req.params.email;
//     // console.log("The set username is : "+setEmail);

//     Users.aggregate([
//         // { email : setEmail},
//         { $unwind :'$bookedPropertyDetails'},
//         { $match : {'email': setEmail}},
//         { $project : { _id: 0, bookedPropertyDetails: 1, email: 1 } }
//         ],
//         function(err,resultNew){
//             if(err){
//                 console.log("\n ----- Some error occured in the query ------");
//                 res.writeHead(400,{
//                     'Content-Type' : 'text/plain'
//                 })
//                 res.end("Error while extracting booked trips data");
//             }
//             else{
//                 res.writeHead(200,{
//                     'Content-Type' : 'text/plain'
//                 })
//                 console.log("\n ----- Proper query execution -------");
//                 // console.log("\nPrinting the result of the query");
//                 var newresult = [];
//                 // console.log(JSON.stringify(resultNew));
//                 for(let i=0;i<resultNew.length; i++){
//                     newresult.push(resultNew[i].bookedPropertyDetails)
//                 }
//                 // console.log(JSON.stringify(newresult)+"\n");
//                 res.end(JSON.stringify(newresult));
//             }
//         }
//     );

//     // var sql = "SELECT a.propertyName, a.ownerEmail, a.blockStart, a.blockEnd, b.country, b.address, b.city, b.state, b.zipcode, b.propertyDescription, b.propertyType, b.bedrooms, b.bathrooms, b.accomodates, b.pricePerNight FROM checkproperty as a INNER JOIN propertydetails as b ON a.propertyName=b.propertyName WHERE a.travelerEmail = "+mysql.escape(setEmail);

//     // pool.getConnection(function(err,con){
//     //     con.query(sql,function(err,result)
//     //     {
//     //         if(err){
//     //             console.log("Error while extracting booked trips data");
//     //             res.writeHead(400,{
//     //                 'Content-Type' : 'text/plain'
//     //             })
//     //             res.end("Error while extracting booked trips data");
//     //         }
//     //         else{
//     //             res.writeHead(200,{
//     //                 'Content-Type' : 'text/plain'
//     //             })
//     //             console.log("Query executed successfully");
//     //             console.log("Printing the result that is sent by MYSQL");
//     //             console.log(JSON.stringify(result));
//     //             res.end(JSON.stringify(result));
//     //         }
//     //     });
//     // })
// });

app.post('/ownerlogin', ownerlogin_request)
// app.post('/ownerlogin',function(req,res){
    
//     console.log("Inside Owner login Post Request");
    
//     var email = req.body.email;
//     var password = req.body.password;

//     Users.findOne({
//         email:req.body.email
//     }, function(err,validuser){
//         if (err) {
//             res.code = "400";
//             res.value = "The email and password you entered doesnot match";
//             console.log(res.value);
//             res.sendStatus(400).end("Invalid Credentials"); 
//         } 
//         // else if(validuser && validuser.password == req.body.password){
//         else if(validuser && bcrypt.compareSync(req.body.password, validuser.password)){
//             res.code = "200";
//             res.value = validuser;

//             let ownerEmail = {email : validuser.email}
//                 var token = jwt.sign(ownerEmail, config.secret, {
//                     expiresIn: 10080 // in seconds
//                 });

//             var newvaliduser = {
//                 'firstname' : validuser.firstname,
//                 'lastname' : validuser.lastname,
//                 'email' : validuser.email,
//                 'password' : validuser.password,
//                 'userflag' : validuser.userflag,
//                 'token' : "JWT "+token 
//             }

//             // console.log("\nPrinting new valid user");
//             // console.log(newvaliduser);

//             res.cookie('cookieO',"owner",{maxAge: 1800000, httpOnly: false, path : '/'});
//             req.session.emailO = validuser.email;
//             // res.sendStatus(200).end(validuser.firstname);
//             // res.end("Successful Login");
//             res.end(JSON.stringify(newvaliduser));
//         }
//     })
        
// });

app.post('/ownersignup', ownersignup_request)
// app.post('/ownersignup',function(req,res){

//     console.log("Inside Owner signup Request Handler");

//     var salt = bcrypt.genSaltSync(10);
//     var hash = bcrypt.hashSync(req.body.password, salt);

//     var newUser = new Users({
//         firstname: req.body.firstname,
//         lastname: req.body.lastname,
//         email: req.body.email,
//         password: hash,
//         userflag: 'O'
//     })

//     newUser.save().then((newUser)=>{
//         console.log("New owner account created !!");
//         console.log(newUser)
//         res.sendStatus(200).end('Owner added successfully');
//     },(err)=>{
//         console.log("Error While signing up owner");
//         res.sendStatus(400).end('Error While signing up owner');
//     })
// });

app.post('/listproperty/photos', requireAuth, ownerproperty_photo_request)
// app.post('/listproperty/photos', requireAuth, (req, res) => {
//     console.log("\nInside post method of list property for uploading images")
//     // console.log("Req file: ",req.file);
//     // console.log("Res file: ",res.file);
//     // console.log("Req body : ");
//     // console.log(JSON.stringify(req.body));
//     // console.log(req.body.fileName);
//     upload(req,res,function(err) 
//     {
//         console.log("Inside the upload method ");
//         // console.log("Req params : "+JSON.stringify(req.params));
//         if(err) {
//             console.log("Error uploading images");
//             return res.end("Error uploading images");
//         }
//     res.end("Property images uploaded successfully");
//     });
// });

app.post('/listproperty/photos/:file(*)', ownerproperty_imagefiles_request)
// app.post('/listproperty/photos/:file(*)', (req, res) => {
//     console.log("\nInside the POST handler of listproperty photos file");
//     // console.log("Req.params file: "+JSON.stringify(req.params.file));
//     // console.log("Req.body : "+JSON.stringify(req.body));
//     var file = req.params.file;
//     var filenames = file.split(',');
//     // console.log(filenames+" and "+filenames.length);
//     var filelocation = [];
//     for(let k=0;k<filenames.length;k++)
//         filelocation.push(path.join(__dirname + '/uploads',filenames[k]))
//     var filelocationstr = filelocation.join();
//     res.writeHead(200, {'Content-Type': 'image/jpg' });
//     res.end(filelocationstr);
//   });

app.post('/listproperty/price/:email', requireAuth, ownerproperty_price_request)
// app.post('/listproperty/price/:email', requireAuth, function(req,res){
    
//     console.log("\nInside Owner post property price details POST Request");
//     console.log("\n================== The set email id is : "+req.params.email+" ======================");
//     // var setEmail = req.session.emailO;
//     var setEmail = req.params.email;
//     // console.log("The set email id in the session is : "+setEmail);

//         Users.update(
//             { email: setEmail },
//             {
//                 $push: {
//                     propertyDetails: {
//                         pCountry: req.body.country,
//                         pAddress: req.body.address,
//                         pCity: req.body.city,
//                         pState: req.body.state,
//                         pZipcode: req.body.zipcode,
//                         pName: req.body.propertyname,
//                         pDescription: req.body.propertydesc,
//                         pType: req.body.propertytype,
//                         pBedrooms: req.body.bedrooms,
//                         pBathrooms: req.body.bathrooms,
//                         pAccomodates: req.body.accomodates,
//                         pImageFiles: req.body.imagefiles,
//                         pAvailableStart: req.body.availableStart,
//                         pAvailableEnd: req.body.availableEnd,
//                         pPricePerNight: req.body.pricePerNight
//                     }
//                 }
//             },
//             { upsert: true },
//             function( err, result ) 
//             {
//                 if ( err ) {
//                     console.log("Some error occured in the update query for owner property details");
//                     res.writeHead(400,{
//                         'Content-Type' : 'text/plain'
//                     })
//                     res.end("Error while adding property information");
//                 }
//                 else{
//                     console.log("Owner property details added successfully in the database");
//                     res.writeHead(200,{
//                         'Content-Type' : 'text/plain'
//                     })
//                     res.end('Property details added successfully');
//                 }
//             }
//         );
// });

app.get('/listproperty/ownerdashboard/data/:email', requireAuth, ownerdashboard_data_request)
// app.get('/listproperty/ownerdashboard/data/:email', requireAuth, function(req,res){
//     console.log("\nInside Owner Dashboard Data Get Handler");
//     console.log("\n================== The set email id is : "+req.params.email+" ======================");
//     // console.log("owner's set email id : "+req.session.emailO);
//     // var setEmail = req.session.emailO;
//     var setEmail = req.params.email
//     Users.find(
//         { email: setEmail },
//         { propertyDetails: 1, _id: 0 },
//         function (err, result) {
//             if (err) {
//                 console.log("Error in getting owner's property details");
//                 res.writeHead(400,{
//                     'Content-Type' : 'text/plain'
//                 })
//                 res.end("Error while extracting data from database");
//             } 
//             else {
//                 console.log("--------- Extracted owner property data from the mongoDB collection ----------");
//                 res.writeHead(200,{
//                     'Content-Type' : 'text/plain'
//                 })

//                 var result1 = [];
//                 result1 = result[0].propertyDetails;
//                 // console.log("result1");
//                 // console.log(result1);
//                 res.end(JSON.stringify(result1));
//             }
//         }
//     );

//     // var sql = "SELECT *  FROM propertydetails WHERE email = '" +setEmail+ "'";

//     // pool.getConnection(function(err,con){
//     //     con.query(sql,function(err,result){
//     //         if(err){
//     //             console.log("Error while extracting data from database");
//     //             res.writeHead(400,{
//     //                 'Content-Type' : 'text/plain'
//     //             })
//     //             res.end("Error while extracting data from database");
//     //         }
//     //         else{
//     //             res.writeHead(200,{
//     //                 'Content-Type' : 'text/plain'
//     //             })
//     //             console.log("\nProperty details of the owner exracted successfully in MYSQL !!");
//     //             console.log(JSON.stringify(result))
//     //             res.end(JSON.stringify(result));
//     //         }
//     //     });
//     // })
// });


app.get('/listproperty/ownerdashboard/image/:email', requireAuth, ownerdashboard_images_request)
// app.get('/listproperty/ownerdashboard/image/:email', requireAuth, function(req,res){
//     console.log("\nInside Owner Dashboard Image Get Handler");
//     console.log("\n================== The set email id is : "+req.params.email+" ======================");
//     // console.log("The owner's set email id : "+req.session.emailO);
//     // var setEmail = req.session.emailO;
//     var setEmail = req.params.email

//     Users.find(
//         { email: req.params.email },
//         { propertyDetails: 1, _id: 0 },
//         function (err, result) {
//             if (err) {
//                 console.log("Error in getting owner's property details");
//                 res.writeHead(400,{
//                     'Content-Type' : 'text/plain'
//                 })
//                 res.end("Error while extracting data from database");
//             } 
//             else {
//                 res.writeHead(200,{
//                     'Content-Type' : 'text/plain'
//                 })
//                 console.log("--------- Extracted owner property images from the mongoDB collection ----------");
//                 // console.log("Printing the result");
//                 // console.log(res);
//                 // console.log("**** res[0].propertyDetails[0].pImageFiles ***");
//                 // console.log(res[0].propertyDetails[0].pImageFiles);
//                 // console.log("*** res[0].propertyDetails[0].pImageFiles ***");
//                 // console.log(res[0].propertyDetails[1].pImageFiles);
//                 // console.log();
//                 var result1 = [];
//                 for(let j=0; j<result[0].propertyDetails.length; j++)
//                 {
//                     result1.push({"imageFiles": result[0].propertyDetails[j].pImageFiles});
//                 }
//                 // console.log("\nPrinting the result made ");
//                 // console.log(JSON.stringify(result1)+"\n");
//                 for(let i=0;i<result1.length;i++)
//                 {
//                     if(result1[i].imageFiles!="0")
//                     {
//                         // console.log(i);
//                         var img = [];
//                         var base64 = [];
//                         var base64str = "";
//                         var imagearr = result1[i].imageFiles.split(',');
//                         for(let k=0;k<imagearr.length;k++)
//                         {
//                             // console.log(imagearr[k])
//                             img.push(fs.readFileSync(imagearr[k]))
//                             base64.push(new Buffer(img[k]).toString('base64'))
//                         }
//                         // console.log("Img array length : "+img.length);
//                         // console.log("base64 array length : "+base64.length);
//                         base64str = base64.join();
//                         result1[i].imageFiles = base64str
//                         // console.log("result["+i+"] updated");
//                     }
//                 }
//                 res.end(JSON.stringify(result1))
//             }
//         }
//     );

//     // var sql = "SELECT imageFiles  FROM propertydetails WHERE email = '" +setEmail+ "'";

//     // pool.getConnection(function(err,con){
//     //     con.query(sql,function(err,result){
//     //         if(err){
//     //             console.log("Error while extracting data from database");
//     //             res.writeHead(400,{
//     //                 'Content-Type' : 'text/plain'
//     //             })
//     //             res.end("Error while extracting data from database");
//     //         }
//     //         else{
//     //             res.writeHead(200,{
//     //                 'Content-Type' : 'text/plain'
//     //             })
//     //             // console.log("Length of data extracted : "+result.length);
//     //             console.log("\n\nprinting the data image data from MYSQL table : ");
//     //             console.log(JSON.stringify(result));
//     //             // console.log();
//     //             for(let i=0;i<result.length;i++)
//     //             {
//     //                 if(result[i].imageFiles!="0")
//     //                 {
//     //                     console.log(i);
//     //                     var img = [];
//     //                     var base64 = [];
//     //                     var base64str = "";
//     //                     var imagearr = result[i].imageFiles.split(',');
//     //                     for(let k=0;k<imagearr.length;k++)
//     //                     {
//     //                         // console.log(imagearr[k])
//     //                         img.push(fs.readFileSync(imagearr[k]))
//     //                         base64.push(new Buffer(img[k]).toString('base64'))
//     //                     }
//     //                     console.log("Img array length : "+img.length);
//     //                     console.log("base64 array length : "+base64.length);
//     //                     base64str = base64.join();
//     //                     result[i].imageFiles = base64str
//     //                     console.log("result["+i+"] updated");
//     //                     // console.log("Type of base64str : "+typeof(base64str));
//     //                 }
//     //             }
//     //             res.end(JSON.stringify(result))
//     //         }
//     //     });
//     // })
// });

app.get('/ownerInbox/:email', requireAuth, ownerInbox_request)

app.post('/replyToTraveler/:email', requireAuth, ownerInbox_replyrequest)

app.listen(3001);
console.log("Server listening on port 3001");