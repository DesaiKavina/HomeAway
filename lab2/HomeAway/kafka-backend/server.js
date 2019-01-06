var connection =  new require('./kafka/Connection');
//topics files
//var signin = require('./services/signin.js');
// var Books = require('./services/books.js');

var traveler_login = require('./services/travelerlogin_post.js')
var traveler_signup = require('./services/travelersignup_post.js')
var traveler_profile = require('./services/travelerprofile_post.js')
var traveler_profile_image = require('./services/travelerprofileimage_post.js')
var traveler_profile_get = require('./services/travelerprofile_get.js')
var homepage_post  = require('./services/homepage_post.js')
var searchresults_bookproperty = require('./services/bookproperty_post.js')
var traveler_ask_question = require('./services/askquestion_post.js')
var traveler_trips = require('./services/travelertrips_get.js')
var traveler_inbox = require('./services/travelerinbox_get.js')

var owner_login = require('./services/ownerlogin_post.js')
var owner_signup = require('./services/ownersignup_post.js')
var property_price = require('./services/propertyprice_post.js')
var ownerdashboard_data = require('./services/ownerdashboarddata_get.js')
var ownerdashboard_images = require('./services/ownerdashboardimages_get.js')
var owner_inbox = require('./services/ownerinbox_get.js')
var owner_inbox_reply = require('./services/ownerinbox_post.js')

function handleTopicRequest(topic_name,fname){
    //var topic_name = 'root_topic';
    var consumer = connection.getConsumer(topic_name);
    var producer = connection.getProducer();
    console.log('server is running ');
    consumer.on('message', function (message) {
        console.log('message received for ' + topic_name +" ", fname);
        console.log(JSON.stringify(message.value));
        var data = JSON.parse(message.value);
        
        fname.handle_request(data.data, function(err,res){
            console.log('---------------- after handle ---------'+res);
            var payloads = [
                { topic: data.replyTo,
                    messages:JSON.stringify({
                        correlationId:data.correlationId,
                        data : res
                    }),
                    partition : 0
                }
            ];
            producer.send(payloads, function(err, data){
                console.log(data);
            });
            return;
        });
        
    });
}
// Add your TOPICs here
//first argument is topic name
//second argument is a function that will handle this topic request
// handleTopicRequest("post_book",Books)
handleTopicRequest("travelerlogin_post",traveler_login)
handleTopicRequest("travelersignup_post", traveler_signup)
handleTopicRequest("travelerprofile_post", traveler_profile)
handleTopicRequest("travelerprofileimage_post", traveler_profile_image)
handleTopicRequest("travelerprofile_get", traveler_profile_get)
handleTopicRequest("homepage_post", homepage_post)
handleTopicRequest("bookproperty_post", searchresults_bookproperty)
handleTopicRequest("askquestion_post",traveler_ask_question)
handleTopicRequest("travelertrips_get",traveler_trips)
handleTopicRequest("travelerinbox_get",traveler_inbox)

handleTopicRequest("ownerlogin_post",owner_login)
handleTopicRequest("ownersignup_post",owner_signup)
handleTopicRequest("propertyprice_post",property_price)
handleTopicRequest("ownerdashboarddata_get",ownerdashboard_data)
handleTopicRequest("ownerdashboardimages_get", ownerdashboard_images)
handleTopicRequest("ownerinbox_get", owner_inbox)
handleTopicRequest("ownerinbox_post", owner_inbox_reply)