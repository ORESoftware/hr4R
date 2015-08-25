/**
 * Created by amills001c on 6/10/15.
 */


//TODO:http://mongoosejs.com/docs/middleware.html

//TODO:once we get email functionality to work, then we can put the project onto Github

// dependencies
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var colors = require('colors');
var validator = require('mongoose-validate');
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;
var REQUIRED_PASSWORD_LENGTH = 8;
var ACCEPTABLE_EMAIL_DOMAINS = ['temp.com', 'cable.comcast.com', 'comcast.com'];

//stuff
var eventBus = require('../events/eventBus.js');

// variables
var mongoDB = null;
var userSchema = null;


var validation = {

    usernameValidator: function (candidate) {
        console.log(candidate);
        return true;
    },
    passwordValidator: function (candidate) {
        //return candidate && candidate.length >= REQUIRED_PASSWORD_LENGTH;
        return true;
    },
    emailValidator: function (candidate) {

        var domain = candidate.substring(candidate.indexOf('@') + 1, candidate.length);


        for (var i = 0; i < ACCEPTABLE_EMAIL_DOMAINS.length; i++) {
            if (ACCEPTABLE_EMAIL_DOMAINS[i] === domain) {
                return true;
            }
        }
        return false;
    }
};


var registerSchema = function () {

    userSchema = new Schema({
            role: {
                type: String,
                enum: ['Admin', 'Owner', 'User']
            },
            username: {
                type: String,
                unique: true,
                required: true,
                validate: [validation.usernameValidator, 'not a valid username']
            },
            passwordHash: {
                type: String,
                required: true,
                validate: [validation.passwordValidator, 'not a valid password']
            },
            email: {
                type: String,
                unique: true,
                required: true,
                validate: [validation.emailValidator, 'not a valid email address']
            },
            firstName: {
                type: String,
                required: false
            },
            lastName: {
                type: String,
                required: false
            },
            registered_at: {
                type: Date,
                default: Date.now
            },
            created_by: {
                type: String,
                required: false,
                default: 'created by unknown user at an unknown time'
            },
            updated_by: {
                type: String,
                required: false,
                default: 'updated by unknown user at an unknown time'
            },
            created_at: {
                type: Date,
                default: Date.now
            },
            updated_at: {
                type: Date,
                default: Date.now
            }
        },
        {
            autoIndex: false
        });

    userSchema.pre('save', function (next) {

        var self = this;
        if (!self.isModified('passwordHash')) {
            return next();
        }

        bcrypt.hash(self.passwordPreHash, SALT_WORK_FACTOR, function (err, hash) {
            if (err) {
                return next(err);
            }
            else if (hash == null) {
                return next(new Error('null/undefined hash'));
            }
            else {
                self.passwordHash = hash;
                next();
            }
        });
    });

    //userSchema.pre('save', function (next) {
    //    var err = new Error('something went wrong');
    //    next(err);
    //});

    //orgSchema.path('timezone').validate(function(value, callback) {
    //    return Timezone.findOne({_id: value}, "_id", function (err, timezone) {
    //        callback(timezone != null);
    //    });
    //}, "Please provide a valid timezone");


    //userSchema.path('username').validate(/^[a-z]+$/i, function (err) {
    //    if (err) {
    //        console.log(err);
    //        return false;
    //    }
    //    return true;
    //});

    userSchema.path('username').validate(function (value, cb) {
        var self = this;
        get(function (err, User) {
            User.findOne({username: value}, function (err, user) {
                if (err) {
                    throw err;
                }
                else if (user) {  //we found a user in the DB already, so this username has been taken
                    if (self._doc._id.equals(user._doc._id)) {
                        cb(true);
                    }
                    else {
                        cb(false);
                    }

                }
                else {
                    cb(true)
                }
            });
        });
    }, 'This username is already taken!');

    userSchema.path('email').validate(function (value, cb) {
        var self = this;
        get(function (err, User) {

            if (err) {
                throw err;
            }

            User.findOne({email: value}, function (err, user) {
                if (err) {
                    //cb(err);
                    throw err;
                }
                else if (user) {  //we found a user in the DB already, so this email has already been registered
                    if (self._doc._id.equals(user._doc._id)) {
                        cb(true);
                    }
                    else {
                        cb(false);
                    }
                }
                else {
                    cb(true)
                }
            });

        });
    }, 'This email address is already taken!');

    /**
     * Methods
     */

    userSchema.method({

        beMerry: function(){

        },
        juice: function(){

        }

    });

    /**
     * Statics
     */

    userSchema.static({

        beMerry: function(){

        },
        juice: function(){

        }

    });


    userSchema.statics.findByEmailAndPassword = function (email, password, cb) {

        this.findOne({email: email}, function (err, user) {
            if (err) {
                return cb(err);
            }
            else if (!user) {
                return cb();
            }
            else {
                bcrypt.compare(password, user.passwordHash, function (err, res) {
                    return cb(err, res ? user : null);
                });
            }

        });

    };

    //userSchema.methods.validPassword = function (pwd) {
    //    return (this.password === pwd);
    //};


    userSchema.methods.validatePassword = function (password, cb) {
        bcrypt.compare(password, this.passwordHash, function (err, res) {
            return cb(err, res ? true : false);
        });
    };

    userSchema.post('save', function (doc) {
        console.log('%s has been saved', doc._id);
    });


};


var UserModel = null;


//var get = function () {
//
//    if(UserModel === null){
//        UserModel = mongoDB.model('users', userSchema);
//        UserModel.ensureIndexes(function(err,msg){
//
//            console.log(err,msg);
//
//        });
//    }
//    else{
//        return UserModel;
//    }
//};

var get = function (cb) {

    //eventBus.emit('userModel', 'message from user model via eventBus!');

    if (UserModel === null) {
        UserModel = mongoDB.model('users', userSchema);

        //TODO: db.collection.createIndex(keys, options)
        UserModel.ensureIndexes(function (err) {
            if (err) {
                console.log(colors.bgRed(err));
                cb(err);
            }
            else{
                cb(null, UserModel);
            }
        });

        UserModel.on('index',function(err,msg){
            if(err){
                console.log(colors.bgRed(err));
                throw err;
            }
           console.log('index event',msg);
        });
    }
    else {
        cb(null, UserModel);
    }
};


module.exports = function (mongo) {
    // save reference to mongoDB
    mongoDB = mongo;
    // register schema
    registerSchema();
    // return model methods
    return {
        registerSchema: registerSchema,
        get: get
    }
};
