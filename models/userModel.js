/**
 * Created by amills001c on 6/10/15.
 */


//TODO:http://mongoosejs.com/docs/middleware.html

//TODO:once we get email functionality to work, then we can put the project onto Github

// dependencies
var mongoose = require('mongoose');
var validator = require('mongoose-validate');
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;
var REQUIRED_PASSWORD_LENGTH = 8;
var ACCEPTABLE_EMAIL_DOMAINS = ['temp.com', 'cable.comcast.com', 'comcast.com'];

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


        for(var i = 0; i < ACCEPTABLE_EMAIL_DOMAINS.length; i++){
                if (ACCEPTABLE_EMAIL_DOMAINS[i] === domain) {
                    return true;
                }
        }
        return false;
    }
};


var registerSchema = function () {

    userSchema = mongoose.Schema({
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
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        registered_at: {
            type: Date,
            default: Date.now
        },
        created_at: {
            type: Date,
            default: Date.now
        },
        updated_at: {
            type: Date,
            default: Date.now
        }
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
        getNewUser().findOne({username: value}, function (err, user) {
            if (err) {
                throw err;
            }
            else if(user){  //we found a user in the DB already, so this username has been taken
                cb(false);
            }
            else{
                cb(true)
            }
        });
    },'This username is already taken!');

    userSchema.path('email').validate(function (value, cb) {
        getNewUser().findOne({email: value}, function (err, user) {
            if (err) {
                //cb(err);
                throw err;
            }
            else if(user){  //we found a user in the DB already, so this email has already been registered
                cb(false);
            }
            else{
                cb(true)
            }
        });
    },'This email address is already taken!');


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
    })


};


var getNewUser = function () {
    return mongoDB.model('users', userSchema);
};


module.exports = function (mongo) {
    // save reference to mongoDB
    mongoDB = mongo;
    // register schema
    registerSchema();
    // return model methods
    return {
        registerSchema: registerSchema,
        getNewUser: getNewUser
    }
};
