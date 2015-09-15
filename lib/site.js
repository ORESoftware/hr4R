/**
 * Created by amills001c on 6/12/15.
 */

//core
var mongoose = require('mongoose');
var events = require('./events');
var colors = require('colors/safe');

/////////////////////////////////////////
var mongoDBConnection = null;
var connectionURI = null;
var env = process.env.NODE_ENV;


if ('development' == env) {
    connectionURI = "mongodb://localhost:27017/".concat('dev_local_db_smartconnect');
    mongoDBConnection = mongoose.connect(connectionURI, {
        native_parser: true
    }, function (err) {
        if (err)
            throw err;
    });
} else if ('test' == env) {
    connectionURI = "mongodb://localhost:27017/".concat('test_local_db_smartconnect');
    mongoDBConnection = mongoose.connect(connectionURI, {
        native_parser: true
    }, function (err) {
        if (err){
            throw err;
        }
    });

} else if ('production' == env) {
    connectionURI = "mongodb://localhost:27017/".concat('prod_local_db_smartconnect');
    mongoDBConnection = mongoose.connect(connectionURI, {
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


// event handling
events.handleMongooseEvents(mongoose);
events.handleMongooseConnection( mongoose.connection );

console.log('mongo connection URI:', colors.blue(connectionURI));

// models
var models = {
    Product: require('../models/product')( mongoDBConnection ),
    User: require('../models/user')( mongoDBConnection ),
    Job: require('../models/job')( mongoDBConnection )
};


module.exports = {
    models: models,
    mongoDB:mongoDBConnection
};