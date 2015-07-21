/**
 * Created by amills001c on 7/17/15.
 */

var express = require('express');
var router = express.Router();
var IJSON = require('idempotent-json');
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;

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

    if(req.specialParams.user_model == null){
        console.log('updating password for a user thats null...');
        return res.send({error:'errrror'});
    }
    else if(req.specialParams.user_model._doc._id !== req.user._doc._id){
        console.log('updating password for a user thats not logged in...');
        return res.send({error:'errrror'});
    }
    else{

        var userData = req.body;
        var firstName = userData.firstName;
        var lastName = userData.lastName;
        var username = userData.username;
        var password = userData.password;

        var UserModel = req.site.models.User;
        UserModel.get(function(err,User){

            User.findOne({
                username: username
            }, function (err, user) {
                if (err) {
                    return done(err);
                }
                else if (!user) {
                    return res.send({error:'incorrect username'});
                }
                else{
                    user.validatePassword(password, function (err, isValid) {
                        if (err) {
                            return res.send({error:err});
                        }
                        else if (!isValid) {
                            return res.send({error:'incorrect password'});
                        }
                        else {

                            return update(User,user,userData,req,res,next);
                        }

                    });
                }
            });

            function update(User,user,userData,req,res,next){


                bcrypt.hash(userData.passwordPreHash, SALT_WORK_FACTOR, function (err, hash) {
                    if (err) {
                        return next(err);
                    }
                    else if (hash == null) {
                        return next(new Error('null/undefined hash'));
                    }
                    else {
                        //user.passwordHash = hash;
                        User.update({ _id: user._id }, { $set: { passwordHash: hash }}, function(err,user){

                            if(err){
                                return res.send({error:'error'});
                            }
                            else{
                                return res.send({success:user});
                            }

                        });
                    }
                });



            }

        });
    }

    //var shasum = crypto.createHash('sha256');
    //shaSum.update(req.body.newPassword);
    //var hashedPassword = shaSum.digest('hex');
    //var Model = req.site.models.User;
    //Model.update({_id: req.user._id}, {$set: {password: hashedPassword}}, {upsert: false}),
    //    function changePasswordCallback(err) {
    //        console.log('change password complete');
    //    }
});


module.exports = router;