/**
 * Created by amills001c on 6/18/15.
 */


var express = require('express');
var router = express.Router();
var passport = require('passport');


router.post('/', function (req, res, next) {

    passport.authenticate('local', function (err, user, info) {
        if (err) {
            return next(err);
        }
        else if (!user) {
            return res.json({loggedIn: false, user: null});
        }
        else {

            req.logIn(user, function (err) {

                if (err) {
                    return next(err);
                }

                res.locals.app = {};
                res.locals.app.currentUser = user._doc;
                return res.json({
                    app: {currentUser: user._doc},
                    loggedIn: true,
                    user:user._doc
                });

        });
    }

})(req, res, next);

});

module.exports = router;
