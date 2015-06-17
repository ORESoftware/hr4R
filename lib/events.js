/**
 * Created by amills001c on 6/12/15.
 */


/**
 * Created by denman on 4/15/2015.
 */

var debug = require('debug');

//add methods where appropriate to globals
if (typeof String.prototype.startsWith != 'function') {
    // see below for better implementation!
    String.prototype.startsWith = function (str) {
        return this.slice(0, str.length) == str;
    };
}


exports.handleExceptions = function () {

    process.on('uncaughtException', function (err) {
        //console.log('Caught exception: ' + err);
        debug('error in process.on(uncaughtException...');
        console.error(err);
        console.error(err.stack);
        throw err;
    });
};


exports.handleProcessEvents = function (mongoose) {

    // If the Node process ends, close the Mongoose connection
    process.on('exit', function (code) {
        console.log('About to exit with code:', code);
        var stack = new Error().stack;
        console.log(stack);
        console.log('This platform is:', process.platform);
        console.log('Process.argv is:', process.argv);
        mongoose.disconnect();
        mongoose.connection.close(function (msg) {
            console.log('Mongoose default connection disconnected through app termination');
            process.exit(0);
        });
    });

    process.on('SIGINT', function (msg1,msg2) {
        mongoose.disconnect();
        mongoose.connection.close(function (msg) {
            console.log(msg);
        });
        console.log('SIGINT message:',msg1,msg2)
    });

};

exports.handleMongooseConnection = function (db) {

    db.on('error', function (err) {
        console.error('mongoDB error:', err);
    });

    db.once('open', function () {
        console.log('mongo connection was opened');
    });
};

exports.handleMongooseEvents = function (mongoose) {
    mongoose.connection.on('connected', function () {
        console.log('Mongoose default connection open');
    });


    mongoose.connection.on('error', function (err) {
        console.error('Mongoose default connection error: ' + err);
    });


    mongoose.connection.on('disconnected', function () {
        console.log('Mongoose default connection disconnected');
    });
};