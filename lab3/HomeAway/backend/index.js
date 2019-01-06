var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var cors = require('cors');
const graphqlHTTP = require('express-graphql');
// var morgan = require('morgan');
var passport = require('passport');
var config = require('./config/settings');
var jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
var kafka = require('./kafka/client');
const schema = require('./schema/schema');

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


app.use("/graphql",graphqlHTTP({
  schema,
  graphiql: true
}));

// app.post('/travelerlogin',travelerlogin_request);


// app.post('/travelersignup',travelersignup_request);


// app.post('/travelerprofile/:email', requireAuth, travelerprofile_data_request);


// app.post('/travelerprofile/imageupload/:email', requireAuth, travelerprofile_image_request);


// app.get('/travelerprofile/:email', requireAuth, travelerprofile_get_request);


// app.post('/homepage/data/:email', requireAuth, homepagedata_request)


// app.get('/searchresults', requireAuth, homepagedata_request)


// app.post('/searchresult/bookpropertyname/:email', requireAuth, homepagedata_request)


// app.post('/searchresult/askOwnerQuestion/:email', requireAuth, traveler_askOwnerQuestion)


// app.get('/travelerInbox/:email', requireAuth, travelerInbox_request)


// app.get('/travelertrips/:email', requireAuth, travelertrips_request)


// app.post('/ownerlogin', ownerlogin_request)


// app.post('/ownersignup', ownersignup_request)


// app.post('/listproperty/photos', requireAuth, ownerproperty_photo_request)


// app.post('/listproperty/photos/:file(*)', ownerproperty_imagefiles_request)


// app.post('/listproperty/price/:email', requireAuth, ownerproperty_price_request)


// app.get('/listproperty/ownerdashboard/data/:email', requireAuth, ownerdashboard_data_request)


// app.get('/listproperty/ownerdashboard/image/:email', requireAuth, ownerdashboard_images_request)


// app.get('/ownerInbox/:email', requireAuth, ownerInbox_request)


// app.post('/replyToTraveler/:email', requireAuth, ownerInbox_replyrequest)

// app.listen(3001);
// console.log("Server listening on port 3001");

app.listen(3001, ()=>{
  console.log("GraphQL server started on port 3001");
})