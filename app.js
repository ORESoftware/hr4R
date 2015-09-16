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

/*

 TODO: old stuff:
 var expressLayouts = require('express-ejs-layouts');
 var compression = require('compression');

 */


//Express app
var app = express();


// Enable CORS
function allowCrossDomain(req, res, next) {
    res.header("Access-Control-Allow-Origin", config.get('sc_admin_constants').allowedCORSOrigins);
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
}

//app.use(allowCrossDomain);

app.use(bodyParser.json({limit: '2mb'}));
app.use(bodyParser.urlencoded({limit: '2mb', extended: true}));

/*

if (process.env.NODE_ENV !== 'development') {
    //app.use(compression());
    app.use(compression({filter: shouldCompress}));
}

if (app.get('env') === 'development') {
    app.use(function (req, res, next) {
        Object.keys(require.cache).forEach(function (key) {
            try {
                if (String(key).indexOf('node_modules') < 0 && String(key).indexOf('routes') > 0) {
                    delete require.cache[require.resolve(key)];
                    console.log(colors.red('deleted cache with keyname: ', key));
                }
            }
            catch (err) {
                console.log(err);
            }
        });
        next();
    });
}

*/


function shouldCompress(req, res) {
    if (req.headers['x-no-compression']) {
        // don't compress responses with this request header
        return false;
    }

    // fallback to standard filter function
    return compression.filter(req, res);
}


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

/*
 TODO: etags
 app.enable('etag') // use strong etags
 app.set('etag', 'strong') // same
 app.set('etag', 'weak') // weak etags
 */


//TODO we should probably *not* directly point browser to bower_components
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
app.use(passport.initialize());
app.use(passport.session());


if (process.env.NODE_ENV === 'development-verbose') {
    app.use(function (req, res, next) {

        console.log('\n\n\n');
        console.log(colors.cyan('New request:'));
        console.log(colors.cyan('______________________________________________________________________________'));
        console.log(colors.blue('METHOD:'), req.method);
        console.log(colors.blue('ORIGINALURL:'), req.originalUrl);
        console.log(colors.blue('HEADERS:'), req.headers);
        console.log(colors.blue('PARAMS:'), req.params);
        console.log(colors.blue('BODY SIZE:'), sizeof(req.body));
        console.log(colors.blue('QUERY:'), req.query);
        console.log(colors.blue('SECRET:'), req.secret);
        console.log(colors.blue('SESSION:'), req.session);
        console.log(colors.blue('SESSION_ID:'), req.session.id);
        console.log(colors.blue('COOKIES:'), req.cookies);
        console.log(colors.cyan('(end of req info)'));
        console.log('\n');

        next();
    });
}


setInterval(function () {
    console.log(util.inspect(process.memoryUsage()));
}, 20000);


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
        //if user is not defined, they are *probably* trying to access the login page, regardless of what url they enter into the searchbar
        //TODO: res.send({msg:'user not authenticated'}), should be redirected to index view'});
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


var runRoute = null;

if (app.get('env') === 'development') {
    runRoute = function (path) {
        return function (req, res, next) {
            require(path)(req, res, next);
        };
    }
}
else {
    runRoute = function (path) {
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
    app.post('/hot-reload', function (req, res, next) {
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
