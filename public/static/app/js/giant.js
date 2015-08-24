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
        '#allCollections',
        'ijson',
        'backbone',
        'underscore'
    ],

    function (appState, io, collections, IJSON, Backbone, _) {


        //TODO: perhaps wait to make socket.io connection after logging in

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

                socket = io.connect('http://127.0.0.1:3001');
                //TODO: how to pass user_id in connection request?

                //TODO: match socket session with express session

                socket.on('error', function socketConnectionErrorCallback(err) {
                    socketEvents.trigger('socket-error', err);
                    console.error('Unable to connect Socket.IO ---->', JSON.stringify(err));
                });

                socket.on('connect', function (event) {
                    socketEvents.trigger('socket-connected', 'connected --> id'.concat(socket.id));
                    console.log('document.cookie after socketio connection:', document.cookie);
                    console.info('successfully established a working and authorized connection'.toUpperCase());
                });

                socket.on('disconnect', function (event) {
                    socketEvents.trigger('socket-disconnected', 'disconnected');
                    console.log('document.cookie after socketio DIS-connection:', document.cookie);
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
                        //return;
                    }

                    console.log('INSERT ON SERVER:', data);
                    var ns = oplogDoc.ns;
                    var split = String(ns).split('.');
                    var dbName = split[0];
                    var collectionName = split[1];
                    var coll = findCollection(collectionName);
                    if (coll) {

                        var _id = data._id;
                        //coll.create(data);
                        //var ModelType = coll.model;
                        //var newModel = new ModelType(data);
                        coll.insertModelSocket(_id,data,{});

                        //coll.add(newModel, {merge: true, silent: true}); //most likely a new model if the DB did an insert
                        //coll.trigger('coll-add-socket',newModel,{});

                        // coll.create saves the model by default which we don't want for this so we go with coll.add
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
                    }else{
                        return;
                        //TODO: fix oplog items that don't pass validation but still appear
                        //throw new Error('no updated_by field present:'+data);
                    }
                    console.log('UPDATE FROM SERVER:', data);
                    var ns = oplogDoc.ns;
                    var split = String(ns).split('.');
                    var dbName = split[0];
                    var collectionName = split[1];
                    var coll = findCollection(collectionName);
                    if (coll) {
                        coll.updateModelSocket(_id,updateInfo,{});
                        //coll.updateModel(_id, updateInfo, {silent:true});
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
                    if (coll) {
                        var _id = oplogDoc.o._id;
                        //coll.remove({_id: _id});
                        coll.removeModelSocket(_id);
                    }
                });


            }

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
            addEvent: addEvent,
            socketEvents: socketEvents
        };
    });

