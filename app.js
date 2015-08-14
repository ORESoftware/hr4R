/**
 * Created by amills001c on 6/15/15.
 */

//TODO: https://scotch.io/tutorials/learn-to-use-the-new-router-in-expressjs-4
//TODO: http://bulkan-evcimen.com/using_express_router_instead_of_express_namespace.html
//TODO: http://mark.aufflick.com/blog/2007/12/06/serve-pre-compressed-content-with-apache

var passport = require('passport');
var colors = require('colors');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var ejs = require('ejs');
//var expressLayouts = require('express-ejs-layouts');
var express = require('express');
//var compression = require('compression');


// Config
var config = require('./config/config_constants.json');

//app
var app = express();

// Enable CORS
function allowCrossDomain(req, res, next) {
    res.header("Access-Control-Allow-Origin", config.allowedCORSOrigins);
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
}

//app.use(allowCrossDomain);
//var router = express.Router();


if (process.env.NODE_ENV !== 'development') {
    //app.use(compression());
    //app.use(compression({filter: shouldCompress}));
}

function shouldCompress(req, res) {
    if (req.headers['x-no-compression']) {
        // don't compress responses with this request header
        return false;
    }

    // fallback to standard filter function
    return compression.filter(req, res);
}


//app.get('*.gz', function(req, res, next) {
//    //req.url = req.url + '.gz';
//    res.set('Content-Encoding', 'gzip');
//    next();
//});

app.use(/(.*)\.gz$/, function(req, res, next) {
    //req.url = req.url + '.gz';
    //TODO: might need .jgz for Safari, etc
    res.set('Content-Encoding', 'gzip');
    console.log('!!! gz encoding set for url:',req.originalUrl);
    next();
});


app.disable('etag'); //TODO: should ETAG be disabled ?

app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser('foo'));
//app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public'), {
    etag: false
}));
//app.use(express.static(path.join(__dirname, '/bower_components')));
//app.use(express.static('bower_components'));
//app.use('/bower_components', express.static( root +'/bower_components'));


var session = require('./lib/controllers/session.js');
app.use(session);


//var expressSession = require('express-session');
//var sessionStore = new expressSession.MemoryStore();
//
//app.use(expressSession({
//    name: 'connect.sid',
//    store: sessionStore,
//    secret: 'foo',
//    saveUninitialized: true,
//    resave: true,
//    cookie: {
//        path: '/',
//        httpOnly: true,
//        secure: false,
//        maxAge: null
//    }
//}));

/*var session = require('express-session');

 app.use(session({
 secret: 'something',
 saveUninitialized: false, // (default: true)
 resave: false, // (default: true)
 cookie: {
 secure: false
 }}));*/

//app.use(expressLayouts);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//app.set('layout', 'layoutx');
app.engine('html', ejs.renderFile);


// initialize passport
//TODO: is it app.use(router) before or after passport?
//TODO: use redis or mongodb for session store?

//app.use(router);
app.use(passport.initialize());
app.use(passport.session());
//app.use(router);


if (process.env.NODE_ENV === 'development') {
    app.use(function (req, res, next) {

        console.log('\n\n');
        console.log(colors.cyan('New request:'));
        console.log(colors.cyan('______________________________________________________________________________'));
        console.log(colors.blue('METHOD:'), req.method);
        console.log(colors.blue('ORIGINALURL:'), req.originalUrl);
        console.log(colors.blue('HEADERS:'), req.headers);
        console.log(colors.blue('PARAMS:'), req.params);
        console.log(colors.blue('BODY:'), req.body);
        console.log(colors.blue('QUERY:'), req.query);
        console.log(colors.blue('SECRET:'), req.secret);
        console.log(colors.blue('SESSION:'), req.session);
        console.log(colors.blue('SESSION_ID:'), req.session.id);
        console.log(colors.blue('COOKIES:'), req.cookies);
        console.log(colors.cyan('(end of req info)'));
        console.log('\n\n');

        next();
    });
}


app.use(function (req, res, next) {

    //this function checks to see, if there is a user logged in and if so, that the session matches the user id
    var user = req.user;
    if (user) {
        if (user._doc._id != req.session.passport.user) {
            console.log('user id is not equal to passport object, logging out...');
            next(new Error('this should never happen when user is defined'));
            //res.redirect('/logout');
        }
        else {
            next();
        }
    }
    else {
        //if user is not defined, they are *probably* trying to access the login page, however,
        //we should check the url here to make sure it doesn't start with "/users"
        //next();

        //TODO: res.send({msg:'user not authenticated, should be redirected to Backbone index view'});
        if (String(req.originalUrl).indexOf('/ra/') === 0) {
            console.log(colors.bgYellow('unauthorized user attempted to request /ra/ route, so rendering index page...'));
            res.locals.loggedInUser = null;
            if (process.env.NODE_ENV !== 'development') {
                res.header("Content-Encoding", "gzip");
            }
            return res.render('index', {title: 'SmartConnect Admin Portal'});
            //TODO: this is probably not sufficient...need to lock user out somehow...?
        }
        else {
            next();
        }
    }
});


/* TODO
 * <FilesMatch "\.css\.jgz$">
 ForceType text/css
 </FilesMatch>
 <FilesMatch "\.js\.jgz$">
 ForceType application/x-javascript
 </FilesMatch>

 */


//app.locals = {
//    title:'SmartConnect Admin Portal'
//};

//app.use(function (req, res, next) {
//    res.locals.loggedInUser = req.user;
//    next();
//});


var site = require('./lib/site');

// reference site singleton in the request
app.use(function (req, res, next) {
    req.site = site;
    next();
});


//passport setup
require('./lib/controllers/passport_setup')(site.models.User);

//params setup
require('./lib/controllers/params')(app);

//routes
app.use('/', require('./routes/index'));
app.use('/updateUserInfo', require('./routes/updateUserInfo'));
app.use('/users', require('./routes/users'));
app.use('/jobs', require('./routes/jobs'));
app.use('/users_batch', require('./routes/batch'));
app.use('/authenticate', require('./routes/authenticate'));
app.use('/register', require('./routes/register'));
app.use('/login', require('./routes/login'));
app.use('/logout', require('./routes/logout'));
//app.use('/testSocketIO', require('./routes/testSocketIO'));


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});


// development error handler
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        if (!res.headersSent) {
            res.status(err.status || 500);
            res.render('error', {
                message: err.message,
                error: err
            });
        }
        else {
            console.error(colors.bgRed(err));
        }
    });
}

// production error handler
app.use(function (err, req, res, next) {
    if (!res.headersSent) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: {}
        });
    }
    else {
        console.error(colors.bgRed(err));
    }

});


module.exports = app;
