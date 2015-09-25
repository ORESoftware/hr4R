/**
 * Created by denmanm1 on 6/15/15.
 */



//logging


//config
var config = require('univ-config')('*SC-Admin*', 'config/conf');


//TODO: save vs insert vs update with upsert:true

//core
var express = require('express');
var router = express.Router();
var passport = require('passport');


/*** registers routes ***/

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

    //TODO: meld this with users.post

    var user = req.body;
    var firstName = user.firstName;
    var lastName = user.lastName;
    var username = user.username;
    var password = user.password;
    var email = user.email;
    var created_by = user.created_by;
    var created_at = user.created_at;
    var updated_by = user.updated_by;
    var updated_at = user.updated_at;


    var UserModel = req.site.models.User;
    UserModel.get(function (err, User) {

        var newUser = new User({
            username: username,
            passwordHash: 'this value is temporary',
            email: email,
            firstName: firstName,
            lastName: lastName,
            created_by: 'temp_created_by',
            created_at: Date.now(),
            updated_by: 'temp_updated_by',
            updated_at: Date.now()
        });

        newUser.passwordPreHash = password;


        newUser.save(function (err, result) {
            if (err) {
                res.json({error: err.errors});  //we pass mongoose errors object to front-end
                return next(err);
            }
            else if (result) {
                delete result.passwordPreHash;
                result.updated_by = String(result._id).toString().concat('@').concat(Date.now());
                result.created_by = String(result._id).toString().concat('@').concat(Date.now());
                result.updated_at = Date.now();
                result.created_at = Date.now();
                result.save(function (err, result) {
                    if (err) {
                        res.json({error: err.errors});  //we pass mongoose errors object to front-end
                        return next(err);
                    }
                    loginNewlyRegisteredUser(result, req, res, next)
                });
            }
            else {
                next(new Error('grave error in user.save() method in /register'));
            }
        });
    });
}

module.exports = router;