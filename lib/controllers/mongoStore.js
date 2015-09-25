/**
 * Created by denmanm1 on 6/22/15.
 */


var mongoose = require('mongoose');
var expressSession = require('express-session');
var MongoStore = require('connect-mongo')(expressSession);


module.exports = new MongoStore({mongooseConnection: mongoose.connection});