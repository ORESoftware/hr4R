/**
 * Created by amills001c on 6/22/15.
 */


var session = require('express-session');
var mongoose = require('mongoose');
var MongoStore = require('connect-mongo')(session);

module.exports = session({
    //secret: process.env.SESSION_SECRET,
    secret: 'foo',
    key: 'connect.sid',
    //key: 'user_session_key',
    saveUninitialized: true, // (default is true)
    resave: true, // (default is true)
    store: new MongoStore({mongooseConnection: mongoose.connection}),
    //store: new MongoStore({mongooseConnection: mongoose.connections[0]}),
    //maxAge: null,
    maxAge: 600000,
    secure: false,
    cookie: {secure: false, maxAge: 600000}
});