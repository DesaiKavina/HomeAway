var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var cors = require('cors');

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

app.use(bodyParser.json());

//Allow Access Control
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
    res.setHeader('Cache-Control', 'no-cache');
    next();
  });

// var finalans = 0;

app.post('/calculatormain', function(req,res){
    // console.log(" - - - - - Inside post request of calculator - - - - - ");
    var expr = req.body.txt;
    var finalans = null;
    // console.log("The data obtained is "+expr);
    const ans = eval(expr);
    if(ans!=null)
        finalans = ans.toString();
    console.log("The final ans is : "+finalans);
    res.send(finalans);
});

app.listen(3001);
console.log("Server Listening on port 3001");