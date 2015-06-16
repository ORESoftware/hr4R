var passport = require('passport');
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
app.use(router);
var session = require('./lib/controllers/session');
var colors = require('colors');
app.use(session);

app.use(expressLayouts);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('layout', 'layout');
app.engine('html', ejs.renderFile);

// initialize passport
app.use(passport.initialize());
app.use(passport.session());


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

console.log('ENVIRONMENT:', colors.bgYellow.blue(app.get('env')));

// Passport auth
app.use(function (req, res, next) {

    //this function checks to see, if there is a user logged in and if so, that the session matches the user id
    var user = req.user;
    if (user) {
        if (user._id !== req.session.passport.user) {
            res.redirect('/logout');
        } else {
            next();
        }
    }
    else {
        //if user is not defined, they are *probably* trying to access the login page, however,
        //we should check the url here to make sure it doesn't start with "/users"
        next();
    }

});

var site = require('./lib/site');

// reference site singleton in the request
app.use(function (req, res, next) {
    req.site = site;
    next();
});


var indexRoute = require('./routes/index');
var usersRoutes = require('./routes/users');
var registerRoute = require('./routes/register');
var authRoute = require('./routes/authenticate');


app.use('/', indexRoute);
app.use('/users*', usersRoutes);
app.use('/authenticate', authRoute);
app.use('/register', registerRoute);


//var routes = require('./routes')(app);
var passport = require('./lib/controllers/passport')(site.models.User);
var params = require('./lib/controllers/params')(app);


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
