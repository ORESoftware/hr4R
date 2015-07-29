/**
 * Created by denman on 7/26/2015.
 */

var redis = require('redis');

var clientSubscribe = redis.createClient();
var clientPublish = redis.createClient();

clientSubscribe.on('ready', function () {
    console.log('clientSubscribe is ready');
    clientSubscribe.subscribe('redis_channel@from_mongo_oplog_server')
});

clientPublish.on('ready', function () {
    console.log('clientPublish is ready');
});

clientSubscribe.on('error', function (err) {
    console.error(err);
});

clientPublish.on('error', function (err) {
    console.error(err);
});


module.exports = {

    rcPub: clientPublish,
    rcSub: clientSubscribe

};