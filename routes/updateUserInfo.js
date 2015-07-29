/**
 * Created by amills001c on 7/17/15.
 */

var express = require('express');
var router = express.Router();
var IJSON = require('idempotent-json');
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;
var _ = require('underscore');

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

router.post('/:user_id', function (req, res, next) {

    if (req.specialParams.user_model == null) {
        console.error('updating password for a user thats null...');
        return res.json({error: 'updating password for a user thats null...'});
    }
    else if (!(req.specialParams.user_model._doc._id.equals(req.user._doc._id))) {
        console.error('updating password for a user thats not logged in...');
        return res.json({error: 'updating password for a user thats not logged in...'});
    }
    else {

        var userData = req.body;

        var updates = {
            firstName: userData.firstName,
            lastName: userData.lastName
        };

        var username = userData.username;
        var password = userData.current_password;
        var new_password = userData.new_password;

        var UserModel = req.site.models.User;
        UserModel.get(function (err, User) {

            User.findOne({
                username: username
            }, function (err, user) {
                if (err) {
                    return done(err);
                }
                else if (!user) {
                    return res.json({error: 'incorrect username'});
                }
                else {
                    user.validatePassword(password, function (err, isValid) {
                        if (err) {
                            return res.json({error: err});
                        }
                        else if (!isValid) {
                            return res.json({error: 'incorrect password'});
                        }
                        else {

                            return update(User, user, userData, req, res, next);
                        }

                    });
                }
            });

            function update(User, user, userData, req, res, next) {

                if (new_password) {
                    bcrypt.hash(new_password, SALT_WORK_FACTOR, function (err, hash) {
                        if (err) {
                            return next(err);
                        }
                        else if (hash == null) {
                            return next(new Error('null/undefined hash'));
                        }
                        else {

                            var pwdUpdates = {
                                passwordHash: hash,
                                old_password: userData.passwordHash,
                                password: null,
                                new_password: null
                            };

                            updates = _.extend({},updates,pwdUpdates);

                            User.update({_id: user._id}, {
                                $set: updates
                            }, function (err, user) {

                                if (err) {
                                    return res.json({error: err});
                                }
                                else {
                                    return res.json({success: user});
                                }

                            });
                        }
                    });
                }
                else {

                    User.update({_id: user._id}, {
                        $set: updates
                    }, function (err, user) {

                        if (err) {
                            return res.json({error: err});
                        }
                        else {
                            return res.json({success: user});
                        }

                    });

                }
            }

        });
    }
});


module.exports = router;