/**
 * Created by amills001c on 6/12/15.
 */


var mongoose = require('mongoose');
var events = require('./events');
var colors = require('colors');

var mongoDB = null;
var connectionURI = null;
var env = process.env.NODE_ENV;

if ('development' == env) {
    connectionURI = "mongodb://localhost:27017/";
    mongoDB = mongoose.connect(connectionURI.concat('dev_local_db_smartconnect'), {
        native_parser: true
    }, function (err) {
        if (err)
            throw err;
    });
} else if ('test' == env) {
    connectionURI = "mongodb://localhost:27017/";
    throw new Error('we arent using test env yet');
    //connectionURI = "mongodb://localhost:19000/";
    mongoDB = mongoose.connect(connectionURI.concat('test_local_db'), {
        native_parser: true
    }, function (err) {
        if (err){
            throw err;
        }
    });

} else if ('production' == env) {
    //connectionURI = "mongodb://localhost:27017/";
    throw new Error('we arent using prod yet');
    //connectionURI = 'mongodb://denmanm1:ewRdik9a@ds033429.mongolab.com:33429/slugapp';
    //connectionURI = 'mongodb://denmanm1:ewRdik9a@ds029122-a0.mongolab.com:29122/slugapp1';
    //connectionURI = 'mongodb://denmanm1:ewRdik9a@proximus.modulusmongo.net:27017/dux9Ewyz';
    mongoDB = mongoose.connect(connectionURI.concat(''), {
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

// event handling
//events.handleProcessEvents(mongoose);
events.handleMongooseEvents(mongoose);
events.handleMongooseConnection( mongoose.connection );

console.log('mongo connection URI:', colors.blue(connectionURI));

// models
var models = {
    User: require('../models/userModel')( mongoDB ),
    Team: require('../models/teamModel')( mongoDB ),
    Player: require('../models/playerModel')( mongoDB ),
    Lineup: require('../models/lineupModel')( mongoDB )
};


module.exports = {
    models: models,
    mongoDB:mongoDB
};