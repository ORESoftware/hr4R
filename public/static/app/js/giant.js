/**
 * Created by amills001c on 6/17/15.
 */


//http://devble.com/create-cookies-in-javascript-read-values/
//TODO: http://geeks.bizzabo.com/post/83917692143/7-battle-tested-backbonejs-rules-for-amazing-web-apps
//TODO: https://www.compose.io/articles/the-mongodb-oplog-and-node-js/

console.log('loading app/js/giant.js');

define(

    [
        '#appState',
        'socketio',
        //'app/js/routers/router',
        //'app/js/allViews',
        'app/js/allCollections',
        'ijson',
        'backbone',
        'underscore'
    ],

    function (appState, io, collections, IJSON, Backbone,_) {


        //TODO: perhaps wait to make socket.io connection after logging in


        function findCollection(name){
            var ret = null;
            for(var collection in collections){
                if (collections.hasOwnProperty(collection)) {
                    var coll = collections[collection];
                    if(coll.uniqueName == name){
                        ret = coll;
                        break;
                    }
                }
            }
            return ret;
        }

        var socketEvents = _.extend({},Backbone.Events);

        var socket = null;

        function getConnection(){

            if(socket == null){
                console.log('document.cookie before socketio:',document.cookie);

               socket = io.connect('http://127.0.0.1:3001');

                //TODO: match socket session with express session


                socket.on('update', function (data) {
                    console.log('UPDATE FROM SERVER:',data);
                    var oplogDoc = IJSON.parse(data);
                    var _id = oplogDoc.o2._id;
                    var ns = oplogDoc.ns;
                    var split = String(ns).split('.');
                    var dbName = split[0];
                    var collectionName = split[1];
                    var coll = findCollection(collectionName);
                    if(coll){
                        var updateInfo = oplogDoc.o.$set;
                        coll.updateModel(_id,updateInfo);
                    }
                });

                socket.on('insert', function (data) {
                    console.log('INSERT ON SERVER:',data);
                    var oplogDoc = IJSON.parse(data);
                    var ns = oplogDoc.ns;
                    var split = String(ns).split('.');
                    var dbName = split[0];
                    var collectionName = split[1];
                    var coll = findCollection(collectionName);
                    if(coll){
                        var data = oplogDoc.o;
                        coll.create(data);
                    }
                });

                socket.on('delete', function (data) {
                    console.log('DELETE ON SERVER:',data);
                    var oplogDoc = IJSON.parse(data);
                    var ns = oplogDoc.ns;
                    var split = String(ns).split('.');
                    var dbName = split[0];
                    var collectionName = split[1];
                    var coll = findCollection(collectionName);
                    if(coll){
                        var _id = oplogDoc.o._id;
                        coll.remove({_id:_id});
                    }
                });


                socket.on('error', function socketConnectionErrorCallback(err) {
                    socketEvents.trigger('socket-error',err);
                    console.error('Unable to connect Socket.IO ---->', JSON.stringify(err));
                });

                socket.on('connect', function (event) {
                    socketEvents.trigger('socket-connected','connected --> id'.concat(socket.id));
                    console.log('document.cookie after socketio connection:',document.cookie);
                    console.info('successfully established a working and authorized connection'.toUpperCase());
                });

                socket.on('disconnect', function (event) {
                    socketEvents.trigger('socket-disconnected','disconnected');
                    console.log('document.cookie after socketio DIS-connection:',document.cookie);
                    console.info('socket disconnected'.toUpperCase());
                });

            }

            appState.set('socketConnection',socket);
            return socket;
        }

        function addEvent(eventName,callback){

            getConnection().on(eventName,function(){
                callback(arguments);
            });

        }


        return {
            getSocketIOConn: getConnection,
            addEvent: addEvent,
            socketEvents: socketEvents
        };
    });

