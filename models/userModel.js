/**
 * Created by amills001c on 6/10/15.
 */


// dependencies
var mongoose = require('mongoose');

// variables
var mongoDB = null;
var userSchema = null;


var registerSchema = function () {

    userSchema = mongoose.Schema({
        username: {
            type: String
            //isUnique: true
            //required: true
        },
        password: {
            type: String
            //required: true
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


    userSchema.path('username').validate(/^[a-z]+$/i, function (err) {
        if (err) {
            console.log(err);
            return false;
        }
        return true;
    });

    userSchema.methods.validPassword = function (pwd) {
        return (this.password === pwd);
    };

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
