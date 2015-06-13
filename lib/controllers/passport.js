/**
 * Created by denman on 12/20/2014.
 */

var request = require('request');
var passport = require('passport');
//var config = require('../config');

var LocalStrategy = require('passport-local').Strategy;
var CustomStrategy = require('passport-custom').Strategy;

module.exports = function ( UserModel ) {

    passport.serializeUser(function (user, done) {
        done(null, user._id);
    });

    passport.deserializeUser(function (id, done) {
        UserModel.getNewUser().findById(id, function (err, user) {
            done(err, user);
        });
    });

    passport.use('local',new LocalStrategy(function (username, password, done) {
        UserModel.getNewUser().findOne({
            username: username
        }, function (err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false, {
                    message: 'Incorrect username.'
                });
            }
            if (!user.validPassword(password)) {
                return done(null, false, {
                    message: 'Incorrect password.'
                });
            }
            // req.user = user;
            return done(null, user);
        });
    }));


    passport.use('custom', new CustomStrategy(
        function(done) {
            User.findOne({ uid: 1 }, function (err, user) {
                if (err) { return done(err); }
                if (!user) { return done(null, false); }
                return done(null, user);
            });
        }
    ));


    return {}
};

