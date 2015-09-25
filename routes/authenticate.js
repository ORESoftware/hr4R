/**
 * Created by denmanm1 on 6/11/15.
 */

//logging


//config
var config = require('univ-config')('*SC-Admin*', 'config/conf');

//core
var express = require('express');
var router = express.Router();


/*** authenticate routes ***/

router.get('/', function (req, res, next) {

    var env = process.env.NODE_ENV;

    if (req.isAuthenticated() && req.user) {
        res.json({
            isAuthenticated: true,
            user: req.user,
            env: env,
            useSocketServer: config.get('use_socket_server'),
            useHotReloader: config.get('use_hot_reloader')
        });
    }
    else {
        res.json({
            isAuthenticated: false,
            user: null,
            env: env,
            useSocketServer: config.get('use_socket_server'),
            useHotReloader: config.get('use_hot_reloader')
        });
    }
});


module.exports = router;
