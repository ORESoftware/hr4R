/**
 * Created by amills001c on 6/17/15.
 */


//http://devble.com/create-cookies-in-javascript-read-values/
//TODO: http://geeks.bizzabo.com/post/83917692143/7-battle-tested-backbonejs-rules-for-amazing-web-apps
//TODO: https://www.compose.io/articles/the-mongodb-oplog-and-node-js/

console.log('loading app/js/oplogSocketClient.js');

define(
    [
        '+appState',
        'socketio',
        '#allCollections',
        'underscore',
        '#allFluxActions'
    ],

    function (appState, socketio, collections, _, allFluxActions) {


        //TODO: perhaps wait to make socket.io connection after logging in

        var OplogClientActions = allFluxActions['OplogClientActions'];


        function findCollection(name) {
            var ret = null;
            for (var collection in collections) {
                if (collections.hasOwnProperty(collection)) {
                    var coll = collections[collection];
                    if (coll.uniqueName == name) {
                        ret = coll;
                        break;
                    }
                }
            }
            return ret;
        }

        var socketEvents = _.extend({}, Backbone.Events);

        var socket = null;


        function getConnection() {

            if (socket == null) {
                console.log('document.cookie before socketio:', document.cookie);

                socket = socketio.connect('http://127.0.0.1:3001');

                //TODO: how to pass user_id in connection request?
                //TODO: match socket session with express session

                socket.on('error', function socketConnectionErrorCallback(err) {
                    socketEvents.trigger('socket-error', err);
                    console.error('Unable to connect Socket.IO ---->', JSON.stringify(err));
                });

                socket.on('connect', function (event) {
                    socketEvents.trigger('socket-connected', 'connected --> id'.concat(socket.id));
                    //console.log('document.cookie after socketio connection:', document.cookie);
                    console.info('successfully established a working and authorized connection'.toUpperCase());
                });

                socket.on('disconnect', function (event) {
                    socketEvents.trigger('socket-disconnected', 'disconnected');
                    //console.log('document.cookie after socketio DIS-connection:', document.cookie);
                    console.info('socket disconnected'.toUpperCase());
                });


                socket.on('insert', function (data) {

                    var oplogDoc = IJSON.parse(data);
                    var data = oplogDoc.o;

                    var created_by = data.created_by;
                    if(created_by){
                        if(created_by === 'temp_created_by'){
                            return;
                        }
                        var createdByUserID = String(created_by).split('@')[0];
                        var currentUserId = appState.get('currentUser') ? appState.get('currentUser').get('_id') : null;
                        if(currentUserId && currentUserId.toString() == createdByUserID){
                            return;
                        }
                    }
                    else{
                        //TODO: fix oplog items that don't pass validation but still appear
                        throw new Error('no created_by field present:'+data);
                    }

                    var ns = oplogDoc.ns;
                    var split = String(ns).split('.');
                    var dbName = split[0];
                    var collectionName = split[1];
                    var coll = findCollection(collectionName);

                    OplogClientActions.insert(collectionName,data);

                    if (coll) {
                        var _id = data._id;
                        coll.insertModelSocket(_id,data,{});
                        //TODO: if silent is set to false, views to seem to render magically for no reason
                    }
                });

                socket.on('update', function (data) {

                    var oplogDoc = IJSON.parse(data);
                    var _id = oplogDoc.o2._id;
                    var updateInfo = oplogDoc.o.$set;
                    var updated_by = updateInfo.updated_by;
                    if(updated_by){
                        if(updated_by === 'temp_updated_by'){
                            return;
                        }
                        var updateUserID = String(updated_by).split('@')[0];
                        var currentUserId = appState.get('currentUser') ? appState.get('currentUser').get('_id') : null;
                        if(currentUserId && currentUserId.toString() == updateUserID){
                            return;
                        }
                    }
                    else{
                        throw new Error('no updated_by field present:'+data);
                        //TODO: fix oplog items that don't pass validation but still appear
                    }

                    var ns = oplogDoc.ns;
                    var split = String(ns).split('.');
                    var dbName = split[0];
                    var collectionName = split[1];
                    var coll = findCollection(collectionName);
                    var data = {_id:_id,updateInfo:updateInfo};
                    OplogClientActions.update(collectionName,data);
                    if (coll) {
                        coll.updateModelSocket(_id,updateInfo,{});
                    }
                });


                socket.on('delete', function (data) {
                    console.log('DELETE ON SERVER:', data);
                    var oplogDoc = IJSON.parse(data);
                    var ns = oplogDoc.ns;
                    var split = String(ns).split('.');
                    var dbName = split[0];
                    var collectionName = split[1];
                    var coll = findCollection(collectionName);
                    OplogClientActions.remove(collectionName,data);
                    if (coll) {
                        var _id = oplogDoc.o._id;
                        coll.removeModelSocket(_id);
                    }
                });
            }

            //_.defaults(socket, Backbone.Events);

            appState.set('socketConnection', socket);
            return socket;
        }

        function addEvent(eventName, target, callback) {

            getConnection().on(eventName, function () {
                //callback(arguments);
                callback.prototype.apply(target,arguments);
            });

        }

        return {
            getSocketIOConn: getConnection,
            socketEvents: socketEvents
        };
    });

