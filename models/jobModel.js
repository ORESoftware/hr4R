/**
 * Created by amills001c on 7/17/15.
 */


// dependencies
var mongoose = require('mongoose');
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
var jobSchema = null;


var validation = {

    jobNameValidator: function (candidate) {
        console.log(candidate);
        return true;
    }
};


var registerSchema = function () {

    jobSchema = mongoose.Schema({
            jobName: {
                type: String
                //enum: ['Admin', 'Owner', 'Job']
            },
            isVerified: {
                type: Boolean
            },
            firstName: {
                type: String
            },
            lastName: {
                type: String
            },
            animals:{
              type: Object
            },
            created_by: {
                type: String,
                required: false,
                default: 'created by unknown user'
            },
            updated_by: {
                type: String,
                required: false,
                default: 'updated by unknown user'
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
            autoIndex:false
        });

    jobSchema.pre('save', function (next) {

        return next();
    });

    

    jobSchema.post('save', function (doc) {
        console.log('%s has been saved', doc._id);
    });

};


var JobModel = null;


var get = function (cb) {

    eventBus.emit('jobModel','message from job model via eventBus!');

    if(JobModel === null){
        JobModel = mongoDB.model('jobs', jobSchema);

        //TODO: db.collection.createIndex(keys, options)

        JobModel.ensureIndexes(function(err){
            if(err){
                console.log(colors.bgRed(err));
            }
            cb(err,JobModel);
        });
    }
    else{
        cb(null,JobModel);
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
