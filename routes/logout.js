/**
 * Created by denmanm1 on 6/15/15.
 */



//logging


//config
var config = require('univ-config')('*SC-Admin*', 'config/conf');

//core
var express = require('express');
var router = express.Router();


/*** logout routes ***/


router.get('/',function (req, res, next) {
    req.session.user_id = undefined;
    req.session.passport.user = null;
    req.user = undefined;
    req.logout();
    req.session.destroy(function (err) {
        if (err) {
            res.json(false);
            return next(err);
        }
        else {
            console.log('req.session.destroy called successfully');
            res.json(true);
        }
    });
});

router.post('/',function (req, res, next) {
    req.session.user_id = undefined;
    req.session.passport.user = null;
    req.user = undefined;
    req.logout();
    req.session.destroy(function (err) {
        if (err) {
            res.json(false);
            return next(err);
        }
        else {
            console.log('req.session.destroy called successfully');
            res.json(true);
        }
    });
});


module.exports = router;