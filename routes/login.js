/**
 * Created by amills001c on 6/18/15.
 */

var router = require('express').Router();
var passport = require('passport');


router.post('/', function (req, res, next) {


    var env = process.env.NODE_ENV;


    passport.authenticate('local', function (err, user, info) {
        if (err) {
            return next(err);
        }
        else if (!user) {
            res.json({isAuthenticated:false, user:null ,env:env,errorMessage:'No user found in DB.'});
        }
        else {

            req.logIn(user, function (err) {

                if (err) {
                    return next(err);
                }

                //res.locals.app = {};
                //res.locals.app.currentUser = user._doc;

                if (req.isAuthenticated()) {
                    res.json({isAuthenticated:true, user:req.user, env:env});
                } else {
                    res.json({isAuthenticated:false, user:null ,env:env});
                }

        });
    }

})(req, res, next);

});

module.exports = router;
