/**
 * Created by amills001c on 6/12/15.
 */


var mongoose = require('mongoose');
var events = require('./events');
var colors = require('colors/safe');

var mongoDB = null;
var connectionURI = null;
var env = process.env.NODE_ENV;

if ('development' == env) {
    connectionURI = "mongodb://localhost:27017/".concat('dev_local_db_smartconnect');
    mongoDB = mongoose.connect(connectionURI, {
        native_parser: true
    }, function (err) {
        if (err)
            throw err;
    });
} else if ('test' == env) {
    connectionURI = "mongodb://localhost:27017/".concat('test_local_db_smartconnect');
    //connectionURI = "mongodb://localhost:19000/";
    mongoDB = mongoose.connect(connectionURI, {
        native_parser: true
    }, function (err) {
        if (err){
            throw err;
        }
    });

} else if ('production' == env) {
    connectionURI = "mongodb://localhost:27017/".concat('prod_local_db_smartconnect');
    //throw new Error('we arent using prod yet');
    //connectionURI = 'mongodb://denmanm1:ewRdik9a@ds033429.mongolab.com:33429/slugapp';
    //connectionURI = 'mongodb://denmanm1:ewRdik9a@ds029122-a0.mongolab.com:29122/slugapp1';
    //connectionURI = 'mongodb://denmanm1:ewRdik9a@proximus.modulusmongo.net:27017/dux9Ewyz';
    mongoDB = mongoose.connect(connectionURI, {
        native_parser: true
    }, function (err) {
        if (err){
            throw err;
        }
    });
}
else{
    throw new Error('SmartConnect-Admin error: no valid env');
}

mongoose.connection.on('index', function (err,msg) {
    if (err) {
        console.error(err);
    }
    else{
        console.log('mongoose on("index") error message:',err);
        console.log('mongoose on("index") msg',msg);
    }
});

//mongoose.on('index', function (err,msg) {
//    if (err) {
//        console.error(err);
//    }
//    else{
//        console.log('mongoose on("index") error message:',err);
//        console.log('mongoose on("index") msg',msg);
//    }
//});

//mongoDB.on('index', function (err,msg) {
//    if (err) {
//        console.error(err);
//    }
//    else{
//        console.log('mongoose on("index") error message:',err);
//        console.log('mongoose on("index") msg',msg);
//    }
//});

// event handling
//events.handleProcessEvents(mongoose);
events.handleMongooseEvents(mongoose);
events.handleMongooseConnection( mongoose.connection );

console.log('mongo connection URI:', colors.blue(connectionURI));

// models
var models = {
    Product: require('../models/productModel')( mongoDB ),
    User: require('../models/userModel')( mongoDB ),
    Job: require('../models/jobModel')( mongoDB )
};


module.exports = {
    models: models,
    mongoDB:mongoDB
};