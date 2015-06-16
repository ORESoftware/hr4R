/**
 * Created by amills001c on 6/15/15.
 */

var express = require('express');
var router = express.Router();
var passport = require('passport');

/*router.get('/', function (req, res, next) {

 var db = req.site.mongoDB;

 var UserModel = req.site.models.User;
 var User = UserModel.getNewUser();
 User.find({}, function (err, items) {
 if (err) {
 throw err;
 }
 console.log(items);
 res.json(items);
 });

 });*/

router.post('/', function (req, res, next) {

  postRegistrationAndOrLoginInfo(req,res,next);

});


function postRegistrationAndOrLoginInfo(req,res,next){

    passport.authenticate('local', function (err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            console.log('no account found, so we will register user as expected...');
            return registerUser(req,res,next);
        }
        else{
            console.log('user already has an account...');
            res.render('home',{
                userInfo:user
            });
        }

    })(req, res, next);
}


function registerUser(req, res, next) {

    console.log('about to register user:', req.body);
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var username = req.body.username;
    var password = req.body.password;
    var email = req.body.email;

    var Model = req.site.models.User;
    var User = Model.getNewUser();

    var newUser = new User({
        username: username,
        password: password,
        email: email,
        firstName: firstName,
        lastName: lastName
    });

    newUser.save(function (err, result) {
        if (err) {
            console.log("error in user save method:", err);
            res.send('database error');
        }
        if (result) {
            console.log('Added new user: ', result);
            postRegistrationAndOrLoginInfo(req,res,next);
            //res.json('successful user registration');
        } else {
            next(new Error('grave error in newUser.save method in registration'));
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