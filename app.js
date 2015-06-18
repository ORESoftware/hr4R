/**
 * Created by amills001c on 6/15/15.
 */

var passport = require('passport');
var colors = require('colors');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var expressLayouts = require('express-ejs-layouts');
var express = require('express');
var app = express();
var router = express.Router();


// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, '/bower_components')));
//app.use(express.static('bower_components'));
//app.use('/bower_components', express.static( root +'/bower_components'));


var session = require('./lib/controllers/session');

app.use(session);

//var session = require('express-session');
//
//app.use(session({
//    secret: 'something',
//    saveUninitialized: false, // (default: true)
//    resave: false, // (default: true)
//    cookie: {
//        secure: false
//    }}));

app.use(expressLayouts);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('layout', 'layout');
app.engine('html', ejs.renderFile);


// initialize passport
//app.use(router);
app.use(passport.initialize());
app.use(passport.session());
app.use(router);


/*app.use(function (req, res, next) {

    console.log(colors.green(''));
    console.log(colors.cyan('New request:'));
    console.log(colors.cyan('___________________________________________________________'));
    console.log(colors.bgYellow('METHOD:'), req.method);
    console.log(colors.bgYellow('HEADERS:'), req.headers);
    console.log(colors.bgYellow('PARAMS:'), req.params);
    console.log(colors.bgYellow('BODY:'), req.body);
    console.log(colors.bgYellow('QUERY:'), req.query);
    console.log(colors.bgYellow('SECRET:'), req.secret);
    console.log(colors.bgYellow('SESSION:'), req.session);
    console.log(colors.bgYellow('COOKIES:'), req.cookies);

    next();

});*/

// Passport auth
/*app.use(function (req, res, next) {

    //this function checks to see, if there is a user logged in and if so, that the session matches the user id
    var user = req.user;
    if (user) {
        if (user._id !== req.session.passport.user) {
            console.log('user id is not equal to passport object, logging out...');
            throw new Error('this shouldnt happen when user is defined');
            //res.redirect('/logout');
        } else {
            next();
        }
    }
    else {
        //if user is not defined, they are *probably* trying to access the login page, however,
        //we should check the url here to make sure it doesn't start with "/users"
        //next();

        //res.send({msg:'user not authenticated, should be redirected to Backbone index view'});

        console.log(colors.bgYellow('req.user is null...'));
        if (String(req.originalUrl).indexOf('/ra/') === 0) {
            console.log(colors.bgYellow('user attempted to request /ra/ route, so rendering index page...'));
            res.locals.loggedInUser = null;
            res.render('index', {title: 'SmartConnect Admin Portal'});
        }
        else {
            next();
        }
    }
});*/


app.use(function (req, res, next) {

    //if(req.user == null){
    //    throw new Error('req.user was null in app.use function.');
    //}
    res.locals.loggedInUser = req.user;
    next();
});

var site = require('./lib/site');

// reference site singleton in the request
app.use(function (req, res, next) {
    req.site = site;
    next();
});


require('./routes/logout')(app);
var indexRoute = require('./routes/index');
var usersRoutes = require('./routes/users');
var registerRoute = require('./routes/register');
var authRoute = require('./routes/authenticate');


app.use('/', indexRoute);
app.use('/users*', usersRoutes);
app.use('/authenticate', authRoute);
app.use('/register', registerRoute);


//require('./routes')(app);
require('./lib/controllers/passport_setup')(site.models.User);
require('./lib/controllers/params')(app);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
