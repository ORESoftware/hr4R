/**
 * Created by amills001c on 6/15/15.
 */


//config
var config = require('univ-config')('*SC-Admin*', 'config/conf');

//core
var passport = require('passport');
var colors = require('colors/safe');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var express = require('express');
var sizeof = require('object-sizeof');
var util = require('util');


//Express app
var app = express();


app.use(bodyParser.json({limit: '2mb'}));
app.use(bodyParser.urlencoded({limit: '2mb', extended: true}));


app.use(/(.*)\.gz$/, function (req, res, next) { //checks if request url ends in .gz
    //TODO: might need .jgz for Safari, etc
    res.set('Content-Encoding', 'gzip');
    console.log(colors.bgGreen('gzip encoding set for url:', req.originalUrl));
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
    etag: false //TODO what about etags?
}));



var session = require('./lib/controllers/session.js');
app.use(session);


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html', ejs.renderFile);


// initialize passport
app.use(passport.initialize());
app.use(passport.session());


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


var runRoute = null;

if (app.get('env') === 'development') {
    runRoute = function (path) {   //this hot reloads all file in the routes dir (serverside hot-reloading - less time waiting for server to restart with nodemon)
        return function (req, res, next) {
            require(path)(req, res, next);
        };
    }
}
else {
    runRoute = function (path) {  //for production, resolves immediately
        return require(path);
    }
}

//ROUTES
app.use('/', runRoute('./routes/index'));
app.use('/updateUserInfo', runRoute('./routes/updateUserInfo'));
app.use('/users', runRoute('./routes/users'));
app.use('/jobs', runRoute('./routes/jobs'));
app.use('/products', runRoute('./routes/products'));
app.use('/batch', runRoute('./routes/batch'));
app.use('/authenticate', runRoute('./routes/authenticate'));
app.use('/register', runRoute('./routes/register'));
app.use('/login', runRoute('./routes/login'));
app.use('/logout', runRoute('./routes/logout'));
app.use('/exp', runRoute('./routes/exp'));


if (app.get('env') === 'development') {
    app.post('/hot-reload', function (req, res, next) {  //route to handle serverside hot-reloading of routes
        var path = req.body.path;
        path = require.resolve(path);
        if (path.indexOf('node_modules') < 0 && path.indexOf('routes') > 0) {
            try {
                delete require.cache[path];
                res.send({success: 'successfully deleted cache with keyname: ' + path});
            }
            catch (err) {
                res.send({error: String(err)});
            }
        }
    });
}


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});


// development error handler
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        console.error(colors.bgRed(err));
        if (!res.headersSent) {
            res.status(err.status || 500);
            res.render('error', {
                message: err.message,
                error: err
            });
        }
    });
}

// production error handler
app.use(function (err, req, res, next) {
    console.error(colors.bgRed(err));
    if (!res.headersSent) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: {}
        });
    }
});


module.exports = app;
