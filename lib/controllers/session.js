/**
 * Created by denmanm1 on 6/15/15.
 */


var expressSession = require('express-session');
var mongoStore = require('./mongoStore.js')

module.exports = expressSession({
    //secret: process.env.SESSION_SECRET,
    secret: 'foo',
    key: 'connect.sid',
    //key: 'user_session_key',
    saveUninitialized: true, // (default is true)
    resave: true, // (default is true)
    store: mongoStore,
    //store: new MongoStore({mongooseConnection: mongoose.connections[0]}),
    //maxAge: null,
    maxAge: 600000,
    secure: false,
    cookie: {
        secure: false,
        maxAge: 600000,
        path:'/',
        httpOnly:false
    }
});