/**
 * Created by denman on 12/20/2014.
 */

var request = require('request');
var passport = require('passport');
var colors = require('colors');
//var config = require('../config');

var LocalStrategy = require('passport-local').Strategy;
var CustomStrategy = require('passport-custom').Strategy;

module.exports = function (UserModel) {


    passport.serializeUser(function (user, done) {
        done(null, user._id);
    });

    passport.deserializeUser(function (id, done) {
        UserModel.get(function (err, model) {
            model.findById(id, function (err, user) {
                done(err, user);
            });
        })
    });


    passport.use('local', new LocalStrategy(function (username, password, done) {
        UserModel.get(function (err, User) {

            User.findOne({
                username: username
            }, function (err, user) {
                if (err) {
                    return done(err);
                }
                else if (!user) {
                    return done(null, false, {
                        message: 'Incorrect username.'
                    });
                }
                else {
                    user.validatePassword(password, function (err, isValid) {
                        if (err) {
                            return done(err);
                        }
                        else if (!isValid) {
                            return done(null, false, {
                                message: 'Incorrect or invalid password.'
                            });
                        }
                        else {
                            return done(null, user);
                        }

                    });
                }

            });

        });
    }));


    /*  passport.use('custom', new CustomStrategy(
     function (done) {
     User.findOne({uid: 1}, function (err, user) {
     if (err) {
     return done(err);
     }
     if (!user) {
     return done(null, false);
     }
     return done(null, user);
     });
     }
     ));*/


    return {}
};

