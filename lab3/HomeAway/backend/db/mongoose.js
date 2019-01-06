var mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// mongoose.connect('mongodb://localhost:27017/homeaway_database');

mongoose.connect('mongodb://root:admin1234@ds243345.mlab.com:43345/homeaway_database')

module.exports = {mongoose};