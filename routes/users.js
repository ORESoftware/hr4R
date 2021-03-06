/**
 * Created by denmanm1 on 6/15/15.
 */


//logging


//config
var config = require('univ-config')('*SC-Admin*', 'config/conf');

//core
var express = require('express');
var router = express.Router();
var IJSON = require('idempotent-json');


//router.use('/', function(req, res, next) {
//    console.log(req.method, req.originalUrl);
//    next();
//}, function (req, res, next) {
//    console.log('');
//    next();
//});

//TODO: nested router
//TODO: http://stackoverflow.com/questions/25260818/rest-with-express-js-nested-router

router.param('user_id', function (req, res, next, user_id) {
    // typically we might sanity check that user_id is of the right format
    if (user_id == undefined || user_id == null) {
        console.log('null user_id');
        return next(new Error("user_id is null"));
    }

    var UserModel = req.site.models.User;
    req.specialParams = {};

    UserModel.get(function (err, User) {
        User.findById(user_id, function (err, user) {
            if (err) {
                return next(err);
            }
            if (!user) {
                req.specialParams.user_model = null;
            }
            else {
                req.specialParams.user_model = user;
            }

            next();
        });
    });
});


// middleware specific to this router
router.use(function timeLog(req, res, next) {
    //console.log('Time: ', Date.now());
    next();
});


router.get('/', function (req, res, next) {

    var UserModel = req.site.models.User;
    UserModel.get(function (err, User) {
        User.find({}, function (err, items) {
            if (err) {
                res.json({error: {}});
                return next(err);
            }
            else {
                res.json({success: items});
            }
        });
    });
});


router.get('/:user_id', function (req, res, next) {

    var user_id = req.params.user_id;
    var user = req.specialParams.user_model;

    if (user) {
        res.json({success: user});
    }
    else {
        res.json({error: {errorMessage: 'no user found for GET operation, probably deleted from DB'}});
        return next(new Error('no user found.'));
    }
});


router.post('/', function (req, res, next) {


    var user = req.body;
    var firstName = user.firstName;
    var lastName = user.lastName;
    var username = user.username;
    var password = user.password;
    var email = user.email;

    var UserModel = req.site.models.User;
    UserModel.get(function (err, User) {

        if (err) {
            throw err;
        }

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
                console.log(colors.gray("mongoose user save callback:", err.message));
                res.send({error: err.errors});
            }
            else if (result) {
                console.log('Added new user: ', result);
                delete result.passwordPreHash;
                res.json({success: result});
            }
            else {
                next(new Error('grave error in newUser.save method in registration'));
            }
        });
    });
});


router.put('/:user_id', function (req, res, next) {


    //TODO: if model doesn't exist yet, we could turn this into a post instead of put, depends on use case and desired functionality, for now, fail fast

    var userToUpdate = req.specialParams.user_model;

    if (userToUpdate == null) {
        res.json({error: {errorMessage: 'no user found for PUT operation, probably deleted from DB'}});
        return next(new Error('router params did not pick up user with PUT users/:user_id'));
    }

    console.log('about to PUT user:', userToUpdate, 'with this info:', req.body);

    var user = req.body;
    var firstName = user.firstName;
    var lastName = user.lastName;
    var username = user.username;
    var password = user.password;

    var updated_at = user.updated_at;
    var updated_by = user.updated_by;


    userToUpdate.firstName = firstName;
    userToUpdate.lastName = lastName;
    userToUpdate.username = username;
    userToUpdate.passwordPreHash = password;
    userToUpdate.updated_at = updated_at;
    userToUpdate.updated_by = updated_by;

    userToUpdate.save(function (err, result) {
        if (err) {
            console.log("error in user put method:", err);
            res.json({error: err});
            return next(err);
        }
        else if (result) {
            console.log('put/updated user: ', result);
            return res.json({success: result});
        }
        else {
            next(new Error('grave error in newUser.save method in registration'));
        }
    });
});


router.delete('/:user_id', function (req, res, next) {

    var UserModel = req.site.models.User;
    UserModel.get(function (err, User) {

        if (err) {
            throw err;
        }
        else {

            var userToDelete = req.specialParams.user_model;

            if (!userToDelete) {
                res.json({error: {errorMessage: 'no user found for DELETE operation, probably already deleted from DB'}});
                return next(new Error('no user matched'));
            }
            else {
                User.remove({_id: userToDelete._id}, function (err) {
                    if (err) {
                        res.send({error: err.toString()});
                        return next(err);
                    }
                    else {
                        res.send({success: userToDelete});
                    }
                });
            }
        }
    });
});


module.exports = router;
