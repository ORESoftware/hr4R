//config
var config = require('univ-config')('*SC-Admin*', 'config/conf');

//core
var express = require('express');
var router = express.Router();


/*** index routes ***/

router.get('/', function (req, res, next) {

    if (req.session.passport.user) {
        console.log("user session exists...checking DB for user");
        var UserModel = req.site.models.User;

        UserModel.get(function (err, model) {

            if (err) {
                throw err;
            }

            model.findById(req.session.passport.user, function (err, user) {
                if (err) {
                    next(err);
                }
                else if (!user) {
                    next(new Error('user session existed, but no user matched'));
                }
                else {

                    var obj = null;
                    var env = process.env.NODE_ENV;
                    var title = 'SmartConnect Admin Portal';

                    if (req.isAuthenticated() && req.user) {
                        obj = {
                            isAuthenticated: true,
                            user: req.user,
                            env: env,
                            title: title,
                            useSocketServer: String(config.get('use_socket_server')),
                            useHotReloader: String(config.get('use_hot_reloader'))
                        };
                    }
                    else {
                        obj = {
                            isAuthenticated: false,
                            user: null,
                            env: env,
                            title: title,
                            useSocketServer: String(config.get('use_socket_server')),
                            useHotReloader: String(config.get('use_hot_reloader'))
                        };
                    }

                    res.render('index', obj);
                }
            });
        });

    }
    else {
        console.log("no passport session found in index route, rendering index page...");
        //TODO: put user auth info in index.ejs?
        var env = process.env.NODE_ENV;
        var title = 'SmartConnect Admin Portal';
        var obj = {
            isAuthenticated: false,
            user: null,
            env: env,
            title: title,
            useSocketServer: String(config.get('use_socket_server')),
            useHotReloader: String(config.get('use_hot_reloader'))
        };
        res.render('index', obj);
    }

});


module.exports = router;
