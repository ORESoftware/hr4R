/**
 * Created by amills001c on 6/15/15.
 */


var session = require('express-session');
var mongoose = require('mongoose');
var MongoStore = require('connect-mongo')(session);

module.exports = session({
    //secret: process.env.SESSION_SECRET,
    secret: 'foo',
    saveUninitialized: true, // (default: true)
    resave: true, // (default: true)
    //store: new MongoStore({'mongoDB': 'sessions'}),
    store: new MongoStore({mongooseConnection: mongoose.connection}),
    //store: new MongoStore({
    //    mongooseConnection: mongoose.connections[0]
    //
    //}),
    //maxAge: 600000,
    maxAge: null,
    //key: 'user_session_key',
    cookie: {secure: false}
});