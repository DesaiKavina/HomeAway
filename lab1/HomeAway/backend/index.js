var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var cors = require('cors');
var mysql = require('mysql');
var pool = require('./pool');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

app.set('view engine','ejs');
app.set('views','./views');

app.use(express.static(__dirname + '/public')); 

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

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
  
// const upload = multer({ storage });

// app.use(cookieParser());

// app.use(session({
//     secret: 'cmpe273_kafka_passport_mongo',
//     resave: false,
//     saveUninitialized: true
//   }));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
    extended: true
  }));


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


app.post('/travelerlogin',function(req,res){
    
    console.log("Inside Traveler login Post Request");
        var email = req.body.email;
        var password = req.body.password;
        var sql = "SELECT *  FROM userinfo WHERE email = " + 
                mysql.escape(email) + "and password = " + mysql.escape(password) +
                "and userflag = 'T' ";

    pool.getConnection(function(err,con){
        if(err){
            res.writeHead(400,{
                'Content-Type' : 'text/plain'
            })
            res.end("Could Not Get Connection Object");
        }
        else{
            con.query(sql,function(err,result){
                if(err){
                    res.writeHead(400,{
                        'Content-Type' : 'text/plain'
                    })
                    Console.log("Error in executing query");
                    res.end("Invalid Credentials");
                }
                else
                {
                    var userflag = result[0].userflag;
                    var username = result[0].firstname;
                    console.log("Username : "+username);
                    if(result.length!=0) {
                        res.cookie('cookieT',"traveler",{maxAge: 1800000, httpOnly: false, path : '/'});
                        req.session.emailT = result[0].email;
                        
                        // console.log("Req.session.user : "+req.session.user);
                        res.writeHead(200,{
                            'Content-Type' : 'text/plain'
                        })
                        console.log("Correct email and password of the traveler !!!!!");
                        res.end(username);
                    }
                    else{
                        res.writeHead(400,{
                            'Content-Type' : 'text/plain'
                        })
                        console.log("Not the correct email and password");
                        res.end("Invalid Credentials");
                    } 
                }
            });
        }
    });
});

app.post('/travelerprofile/imageupload',(req, res) => {
    console.log("Inside traveler profile image upload post request");
    console.log("The current set email ID is : "+req.session.emailT);
    upload(req,res,function(err) 
    {
        console.log("Insid upload method");
        // console.log("Req.file : "+JSON.stringify(req.files));
        var filename = req.files[0].originalname;
        // console.log("Uploaded filename : "+filename);
        if(err) {
            console.log("Error uploading profile image");
            return res.end("Error uploading profile image");
        }
        else{
            var sql = "UPDATE userinfo SET profileImage = '"+filename+"' WHERE email = '"+req.session.emailT+"'";
            console.log("Printing the sql query : \n"+sql);

            pool.getConnection(function(err,con){
                if(err){
                    res.writeHead(400,{
                        'Content-Type' : 'text/plain'
                    })
                    res.end("Could Not Get Connection Object");
                }
                else{
                    con.query(sql,function(err,result){
                        if(err)
                        {
                            console.log("Error while executing query !!!!");
                            res.writeHead(400,{
                                'Content-Type' : 'text/plain'
                            })
                            res.end("Error updating traveler profile information");
                        }
                        else
                        {
                            res.writeHead(200,{
                                'Content-Type' : 'text/plain'
                            })
                            console.log("Traveler profile pic  updated successfully");
                            res.end('Traveler profile pic updated successfully');
                        }
                    });
                }
            });

        }
    // res.end("Profile Image uploaded successfully");
    });
});

app.get('/travelerprofile',function(req,res){
    console.log("Inside Traveler Profile Get Handler");
    // console.log(`Req.session.email inside travelerprofile GET method : ${JSON.stringify(req.session)}`);
    console.log("Req.session.emailT : "+req.session.emailT);
    var emailid = req.session.emailT;
    // var emailid = "randomtraveler@gmail.com"
    var sql = "SELECT *  FROM userinfo WHERE email = '" +emailid+ "'";
    pool.getConnection(function(err,con){
        con.query(sql,function(err,result){
            if(err){
                console.log("Error while extracting data from database");
                res.writeHead(400,{
                    'Content-Type' : 'text/plain'
                })
                res.end("Error while extracting data from database");
            }
            else{
                console.log("Traveler data extracted successfully from the database table !!");
                // console.log("Profile image of the traveler : "+result[0].profileImage);
                // console.log("Printing the result : \n"+JSON.stringify(result));
                var filename = result[0].profileImage;
                if(filename==null){
                    console.log("Profile image not yet set");
                    res.writeHead(200,{
                        'Content-Type' : 'text/plain'
                    })
                    res.end(JSON.stringify(result));
                }
                else
                {
                    var fileLocation = path.join(__dirname + '/uploads',filename);
                    var img = fs.readFileSync(fileLocation);
                    var base64img = new Buffer(img).toString('base64');
                    result[0].profileImage = base64img;
                    res.writeHead(200,{
                        'Content-Type' : 'text/plain'
                    })
                    res.end(JSON.stringify(result));
                }
            }
        });
    })
});

app.post('/travelersignup',function(req,res){

    console.log("Inside Traveler signup Request Handler");

    var sql = "INSERT INTO userinfo(firstname, lastname, email, password, userflag) VALUES ( " + 
    mysql.escape(req.body.firstname) + " , " + mysql.escape(req.body.lastname) + " , " +
    mysql.escape(req.body.email) + " , "+ mysql.escape(req.body.password) + " , " + " 'T' " + " ) ";

    pool.getConnection(function(err,con){
        con.query(sql,function(err,result){
            if(err){
                console.log("Error while inserting the data, improper input data !!!!");
                res.writeHead(400,{
                    'Content-Type' : 'text/plain'
                })
                res.end("Error While signing up traveler");
            }else{
                res.writeHead(200,{
                    'Content-Type' : 'text/plain'
                })
                console.log("Traveler added successfully");
                res.end('Traveler added successfully');
            }
        });
    })
});

app.post('/travelerprofile',function(req,res){
    
    console.log("Inside Traveler profile Post Request");
        
        var sql = "UPDATE userinfo SET firstname = " +mysql.escape(req.body.firstname)+ 
                ", lastname = "+mysql.escape(req.body.lastname)+ ", aboutme = "+mysql.escape(req.body.aboutme)+
                ", city = "+mysql.escape(req.body.city)+ ", country = "+mysql.escape(req.body.country)+
                ", company = "+mysql.escape(req.body.company)+ ", school = "+mysql.escape(req.body.school)+
                ", hometown = "+mysql.escape(req.body.hometown)+ ", languages = "+mysql.escape(req.body.languages)+
                ", gender = "+mysql.escape(req.body.gender)+ ", phoneno = "+mysql.escape(req.body.contact)+
                " WHERE email = "+mysql.escape(req.body.setEmail);

    pool.getConnection(function(err,con){
        if(err){
            res.writeHead(400,{
                'Content-Type' : 'text/plain'
            })
            res.end("Could Not Get Connection Object");
        }
        else{
            con.query(sql,function(err,result){
                if(err)
                {
                    console.log("Error while executing query !!!!");
                    res.writeHead(400,{
                        'Content-Type' : 'text/plain'
                    })
                    res.end("Error updating traveler profile information");
                }
                else
                {
                    res.writeHead(200,{
                        'Content-Type' : 'text/plain'
                    })
                    res.end('Traveler info updated successfully');
                }
            });
        }
    });
});

app.post('/homepage/data',function(req,res){
    console.log("Inside post request from homepage for property search");
    // console.log("Data obtained from frontend");
    // console.log(JSON.stringify(req.body));
    app.set('travelerSearchData', req.body);
    var parsedstart = Date.parse(req.body.startDate);
    // console.log("Start date : "+parsedstart);
    var parsedend = Date.parse(req.body.endDate);
    // console.log("End date : "+parsedend);

    var sql = "SELECT * from propertydetails where city = " + mysql.escape(req.body.location)+
                "and accomodates > "+mysql.escape(req.body.guests);

    pool.getConnection(function(err,con){
        con.query(sql,function(err,result){
            if(err){
                console.log("Error while fetching data from the database");
                res.writeHead(400,{
                    'Content-Type' : 'text/plain'
                })
                res.end("Error while fetching data from the database");
            }else{
                res.writeHead(200,{
                    'Content-Type' : 'text/plain'
                })

                // console.log("Length of the result object : "+result.length);
                var result1 = [];
                for(let i=0;i<result.length;i++)
                {
                    // console.log(JSON.stringify(result[i])+"\n");
                    var obtainedStart = Date.parse(result[i].availableStart);
                    // console.log("Start date from database : "+obtainedStart);
                    var obtainedEnd = Date.parse(result[i].availableEnd);
                    // console.log("End date from database : "+obtainedEnd);
                    if( Date.parse(result[i].availableStart) < parsedstart && Date.parse(result[i].availableEnd) > parsedend)
                    {
                        result1.push(result[i]);
                    }
                }
                // console.log("Printing result1 \n"+JSON.stringify(result1));
                app.set('result_one', result1);
                // console.log("result1's owner's email : "+result1[0].email);
                res.end('Traveler added successfully');
            }
        });
    })
});

app.get('/searchresults', function(req,res){
    console.log("Inside GET method of search results"); 
    var res_one = app.get('result_one');
    // console.log("The result obtained from previous route : \n"+JSON.stringify(res_one));
    for(let i=0;i<res_one.length;i++)
    {
        if(res_one[i].imageFiles!="0")
        {
            console.log(i);
            var img = [];
            var base64 = [];
            var base64str = "";
            var imagearr = res_one[i].imageFiles.split(',');
            for(let k=0;k<imagearr.length;k++)
            {
                img.push(fs.readFileSync(imagearr[k]))
                base64.push(new Buffer(img[k]).toString('base64'))
            }
            // console.log("Img array length : "+img.length);
            // console.log("base64 array length : "+base64.length);
            base64str = base64.join();
            res_one[i].imageFiles = base64str
            // console.log("res_one["+i+"] updated");
        }
    }
    res.end(JSON.stringify(res_one));
});

app.post('/searchresult/bookpropertyname', function(req,res){
    console.log("Inside GET handler of search result book property name");
    var propertyname = req.body.bookpropertyname;
    // console.log("Getting the property name from frontend : "+propertyname);
    var searchdata = app.get('travelerSearchData');
    console.log("The search query fired by the traveler was");
    console.log(JSON.stringify(searchdata));
    var setEmail = req.session.emailT;

    var sql = "SELECT email from propertydetails WHERE propertyName = "+mysql.escape(propertyname);
    pool.getConnection(function(err,con){
        con.query(sql,function(err,result){
            if(err){
                console.log("Error while inserting the data, improper input data !!!!");
                res.writeHead(400,{
                    'Content-Type' : 'text/plain'
                })
                res.end("Error While signing up traveler");
            }else{
                res.writeHead(200,{
                    'Content-Type' : 'text/plain'
                })
                // console.log("Printing the data of owner email from propertydetails table");
                // console.log(JSON.stringify(result));
                var owneremail = result[0].email;
                // console.log("Owner email from result object : "+owneremail);

                var sql1 = "INSERT INTO checkproperty(propertyName, ownerEmail, travelerEmail, blockStart, blockEnd) VALUES ( " + 
                    mysql.escape(propertyname) + " , " + mysql.escape(owneremail) + " , " +
                    mysql.escape(setEmail) + " , "+ mysql.escape(searchdata.startDate) + " , " + mysql.escape(searchdata.endDate) + ")";

                // console.log("Printing the query for insertion in checkavailability table : \n"+sql1);
                    
                    pool.getConnection(function(err,con){
                        con.query(sql1,function(err,result1){
                            if(err){
                                console.log("Error while inserting the data, improper input data !!!!");
                                res.writeHead(400,{
                                    'Content-Type' : 'text/plain'
                                })
                                res.end("Error While signing up traveler");
                            }else{
                                // res.writeHead(200,{
                                //     'Content-Type' : 'text/plain'
                                // })
                                console.log("Successful final insert query");
                                // console.log(JSON.stringify(result1));
                                res.end('Traveler added successfully');
                            }
                        });
                    })

                // res.end('Traveler added successfully');
            }
        });
    })
});

app.get('/travelertrips', function(req,res){
    console.log("Inside traveler trips GET request");
    var setEmail = req.session.emailT;
    console.log("The set username is : "+setEmail);

    var sql = "SELECT a.propertyName, a.ownerEmail, a.blockStart, a.blockEnd, b.country, b.address, b.city, b.state, b.zipcode, b.propertyDescription, b.propertyType, b.bedrooms, b.bathrooms, b.accomodates, b.pricePerNight FROM checkproperty as a INNER JOIN propertydetails as b ON a.propertyName=b.propertyName WHERE a.travelerEmail = "+mysql.escape(setEmail);
    
    // var sql = "SELECT checkproperty.propertyName, checkproperty.ownerEmail, propertydetails.propertyDescription FROM checkproperty INNER JOIN propertydetails ON checkproperty.propertyName=propertydetails.propertyName";

    // console.log("Printing the SQL query : \n"+sql);

    pool.getConnection(function(err,con){
        con.query(sql,function(err,result)
        {
            if(err){
                console.log("Error while extracting booked trips data");
                res.writeHead(400,{
                    'Content-Type' : 'text/plain'
                })
                res.end("Error while extracting booked trips data");
            }
            else{
                res.writeHead(200,{
                    'Content-Type' : 'text/plain'
                })
                console.log("Query executed successfully");
                // console.log("Printing the result");
                // console.log(JSON.stringify(result));
                res.end(JSON.stringify(result));
            }
        });
    })
});

app.post('/ownerlogin',function(req,res){
    
    console.log("Inside Owner login Post Request");
        req.session.email = req.body.email;
        var email = req.body.email;
        var password = req.body.password;
        var sql = "SELECT *  FROM userinfo WHERE email = " + 
                mysql.escape(email) + "and password = " + mysql.escape(password) + 
                "and userflag = 'O' ";

    pool.getConnection(function(err,con){
        if(err){
            res.writeHead(400,{
                'Content-Type' : 'text/plain'
            })
            res.end("Could Not Get Connection Object");
        }
        else{
            con.query(sql,function(err,result){
                if(err){
                    res.writeHead(400,{
                        'Content-Type' : 'text/plain'
                    })
                    Console.log("Error in executing query");
                    res.end("Invalid Credentials");
                }
                else
                {
                    var userflag = result[0].userflag;
                    if(result.length!=0) {
                        res.cookie('cookieO',"owner",{maxAge: 1800000, httpOnly: false, path : '/'});
                        req.session.emailO = result[0].email;
                        res.writeHead(200,{
                            'Content-Type' : 'text/plain'
                        })
                        console.log("Correct email and password of the owner !!!!!");
                        res.end("Successful Login");
                    }
                    else{
                        res.writeHead(400,{
                            'Content-Type' : 'text/plain'
                        })
                        console.log("Not the correct email and password");
                        res.end("Invalid Credentials");
                    } 
                }
            });
        }
    });
});


app.post('/ownersignup',function(req,res){

    console.log("Inside Owner signup Request Handler");

    var sql = "INSERT INTO userinfo(firstname, lastname, email, password, userflag) VALUES ( " + 
        mysql.escape(req.body.firstname) + " , " + mysql.escape(req.body.lastname) + " , " +
        mysql.escape(req.body.email) + " , "+ mysql.escape(req.body.password) + " , " + " 'O' " + " ) ";

    pool.getConnection(function(err,con){
        con.query(sql,function(err,result){
            if(err){
                console.log("Error while inserting the data, improper input data !!!!");
                res.writeHead(400,{
                    'Content-Type' : 'text/plain'
                })
                res.end("Error While signing up owner");
            }else{
                res.writeHead(200,{
                    'Content-Type' : 'text/plain'
                })
                res.end('Owner added successfully');
            }
        });
    })
});

app.post('/listproperty/photos', (req, res) => {
    // console.log("Req file: ",req.file);
    // console.log("Res file: ",res.file);
    // console.log("Req body : ");
    // console.log(JSON.stringify(req.body));
    // console.log(req.body.fileName);
    upload(req,res,function(err) 
    {
        console.log("Inside the upload method ");
        // console.log("Req params : "+JSON.stringify(req.params));
        if(err) {
            console.log("Error uploading images");
            return res.end("Error uploading images");
        }
    res.end("Images uploaded successfully");
    });
});

app.post('/listproperty/photos/:file(*)',(req, res) => {
    console.log("Inside the POST handler of listproperty photos file");
    // console.log("Req.params file: "+JSON.stringify(req.params.file));
    // console.log("Req.body : "+JSON.stringify(req.body));
    var file = req.params.file;
    var filenames = file.split(',');
    // console.log(filenames+" and "+filenames.length);
    var filelocation = [];
    for(let k=0;k<filenames.length;k++)
        filelocation.push(path.join(__dirname + '/uploads',filenames[k]))
    // console.log("File locations : ");
    // console.log(filelocation);
    var filelocationstr = filelocation.join();
    // console.log("String : "+filelocationstr);
    // var fileLocation = path.join(__dirname + '/uploads',file);
    // var img = fs.readFileSync(fileLocation);
    // var base64img = new Buffer(img).toString('base64');
    res.writeHead(200, {'Content-Type': 'image/jpg' });
    res.end(filelocationstr);
  });

app.post('/listproperty/price',function(req,res){
    
    console.log("Inside Owner post property price details POST Request");
        var setEmail = req.session.emailO;
        console.log("The set email id in the session is : "+setEmail);

        var sql = "UPDATE propertydetails SET availableStart = " +mysql.escape(req.body.availableStart)+ 
                ", availableEnd = "+mysql.escape(req.body.availableEnd)+ ", pricePerNight = "+mysql.escape(req.body.pricePerNight)+
                " WHERE email = "+"'"+setEmail+"'";

        var sql = "INSERT INTO propertydetails(email, country, address, city, state, zipcode, propertyName, propertyDescription, propertyType, bedrooms, bathrooms, accomodates, imageFiles, availableStart, availableEnd, pricePerNight) VALUES ( " + 
                "'"+setEmail+"'" + " , " + mysql.escape(req.body.country) + " , " +
                mysql.escape(req.body.address) + " , "+ mysql.escape(req.body.city) + " , " +
                mysql.escape(req.body.state) + " , "+ mysql.escape(req.body.zipcode) + " , " +
                mysql.escape(req.body.propertyname) + " , "+ mysql.escape(req.body.propertydesc) + " , " +
                mysql.escape(req.body.propertytype) + " , "+ mysql.escape(req.body.bedrooms) + " , " +
                mysql.escape(req.body.bathrooms) + " , "+ mysql.escape(req.body.accomodates) + " , " + mysql.escape(req.body.imagefiles) + " , " +
                mysql.escape(req.body.availableStart) + " , "+ mysql.escape(req.body.availableEnd) + " , " +
                mysql.escape(req.body.pricePerNight) + ")";

        // console.log("Printing the query : \n"+sql);

    pool.getConnection(function(err,con){
        if(err){
            res.writeHead(400,{
                'Content-Type' : 'text/plain'
            })
            res.end("Could Not Get Connection Object");
        }
        else{
            con.query(sql,function(err,result){
                if(err)
                {
                    console.log("Error while executing query !!!!");
                    res.writeHead(400,{
                        'Content-Type' : 'text/plain'
                    })
                    res.end("Error while adding property information");
                }
                else
                {
                    res.writeHead(200,{
                        'Content-Type' : 'text/plain'
                    })
                    res.end('Property details added successfully');
                }
            });
        }
    });
});

app.get('/listproperty/ownerdashboard/data',function(req,res){
    console.log("Inside Owner Dashboard Data Get Handler");
    console.log("Req.session.emailO : "+req.session.emailO);
    var setEmail = req.session.emailO;

    var sql = "SELECT *  FROM propertydetails WHERE email = '" +setEmail+ "'";

    pool.getConnection(function(err,con){
        con.query(sql,function(err,result){
            if(err){
                console.log("Error while extracting data from database");
                res.writeHead(400,{
                    'Content-Type' : 'text/plain'
                })
                res.end("Error while extracting data from database");
            }
            else{
                res.writeHead(200,{
                    'Content-Type' : 'text/plain'
                })
                console.log("Property details of the owner exracted successfully !!");
                // console.log("Length of data extracted : "+result.length);
                // console.log("printing the data : ");
                // console.log(JSON.stringify(result));
                res.end(JSON.stringify(result));
                // res.end('Owner added successfully');
            }
        });
    })
});

app.get('/listproperty/ownerdashboard/image',function(req,res){
    console.log("Inside Owner Dashboard Image Get Handler");
    console.log("Req.session.emailO : "+req.session.emailO);
    var setEmail = req.session.emailO;

    var sql = "SELECT imageFiles  FROM propertydetails WHERE email = '" +setEmail+ "'";

    pool.getConnection(function(err,con){
        con.query(sql,function(err,result){
            if(err){
                console.log("Error while extracting data from database");
                res.writeHead(400,{
                    'Content-Type' : 'text/plain'
                })
                res.end("Error while extracting data from database");
            }
            else{
                res.writeHead(200,{
                    'Content-Type' : 'text/plain'
                })
                // console.log("Length of data extracted : "+result.length);
                // console.log("printing the data : ");
                // console.log(JSON.stringify(result));
                // console.log();
                for(let i=0;i<result.length;i++)
                {
                    if(result[i].imageFiles!="0")
                    {
                        console.log(i);
                        var img = [];
                        var base64 = [];
                        var base64str = "";
                        var imagearr = result[i].imageFiles.split(',');
                        for(let k=0;k<imagearr.length;k++)
                        {
                            console.log(imagearr[k])
                            img.push(fs.readFileSync(imagearr[k]))
                            base64.push(new Buffer(img[k]).toString('base64'))
                        }
                        // console.log("Img array length : "+img.length);
                        // console.log("base64 array length : "+base64.length);
                        base64str = base64.join();
                        result[i].imageFiles = base64str
                        // console.log("result["+i+"] updated");
                        // console.log("Type of base64str : "+typeof(base64str));
                    }
                }
                res.end(JSON.stringify(result))
            }
        });
    })
});

app.listen(3001);
console.log("Server listening on port 3001");