/**
 * Created by amills001c on 6/15/15.
 */

var express = require('express');
var router = express.Router();
var passport = require('passport');


router.post('/', function (req, res, next) {

    postRegistrationInfo(req, res, next, false);

});


function postRegistrationInfo(req, res, next, justRegistered) {

    passport.authenticate('local', function (err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            if (justRegistered) {
                return next(new Error('user was just registered, so user should be defined.'));
            }
            console.log('no account found, so we will register user as expected...');
            registerUser(req, res, next);
        }
        else { //the user is already registered, we will log them in

            req.logIn(user, function (err) {

                if (err) {
                    return next(err);
                }

                res.json({
                    success: {
                        user: user._doc,
                        alreadyRegistered: true,
                        authorized: true
                    }

                });
            });
        }

    })(req, res, next);
}


function loginNewlyRegisteredUser(user, req, res, next) {

    req.logIn(user, function (err) {

        if (err) {
            res.json({
                error: err
            });
            return next(err);
        }

        res.json({
            success: {
                user: user._doc,
                alreadyRegistered: false,
                authorized: true
            }
        });
    });

}


function registerUser(req, res, next) {

    console.log('about to register user:', req.body);

    var user = req.body;
    var firstName = user.firstName;
    var lastName = user.lastName;
    var username = user.username;
    var password = user.password;
    var email = user.email;

    var UserModel = req.site.models.User;
    var User = UserModel.getNewUser();

    var newUser = new User({
        username: username,
        passwordHash: 'this value is temporary',
        email: email,
        firstName: firstName,
        lastName: lastName
    });

    newUser.passwordPreHash = password;


    newUser.save(function (err, result) {
        if (err) {
            res.json({error: err.errors});  //we pass mongoose errors object to front-end
            return next(err);
        }
        else if (result) {
            delete result.passwordPreHash;
            loginNewlyRegisteredUser(result, req, res, next)
        }
        else {
            next(new Error('grave error in user.save() method in /register'));
        }
    });
}

exports.changePassword = function (req, res, next) {

    // APP render as opposed to res.render???

    var shasum = crypto.createHash('sha256');
    shaSum.update(req.body.newPassword);
    var hashedPassword = shaSum.digest('hex');
    var Model = req.site.models.User;
    Model.update({_id: req.user._id}, {$set: {password: hashedPassword}}, {upsert: false}),
        function changePasswordCallback(err) {
            console.log('change password complete');
        }
};

module.exports = router;