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
        'backbone'
    ],

    function (appState, io, collections, IJSON, Backbone) {


        //TODO: perhaps wait to make socket.io connection after logging in


        function findCollection(name){
            var ret = null;
            for(var collection in collections){
                if (collections.hasOwnProperty(collection)) {
                    var coll = collections[collection];
                    if(coll.uniqueName == name){
                        ret = coll;
                        //return false;
                        break;
                    }
                }
            };
            return ret;
        }

        var socket = null;

        function getConnection(){

            if(socket == null){
                console.log('document.cookie before socketio:',document.cookie);

               socket = io.connect('http://127.0.0.1:3001');

                //TODO: match socket session with express session


                socket.on('burger', function (msg) {
                    console.log('server sent a message to the client,', msg);

                    //var parsed = JSON.parse(msg);

                    socket.emit('sent info to client');
                });

                //socket.emit('chat message', 'this is the user talking to the server');


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


                socket.on('error', function socketConnectionErrorCallback(reason) {
                    console.error('Unable to connect Socket.IO ---->', reason);
                });

                socket.on('connect', function () {
                    console.log('document.cookie after socketio connection:',document.cookie);
                    console.info('successfully established a working and authorized connection'.toUpperCase());
                });

            }
            return socket;
        }

        function addEvent(eventName,callback){

            getConnection().on(eventName,function(){
                callback(arguments);
            });

        }


        return {
            getSocketIOConn: getConnection,
            addEvent: addEvent
        };
    });

