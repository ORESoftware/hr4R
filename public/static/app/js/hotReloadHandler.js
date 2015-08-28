/**
 * Created by amills001c on 8/27/15.
 */


//TODO: http://devble.com/create-cookies-in-javascript-read-values/


console.log('loading app/js/giant.js');

define(
    [
        '#appState',
        '#viewState',
        'socketio',
        '#allCollections',
        'ijson',
        'backbone',
        'underscore'
    ],

    function (appState, viewState, io, collections, IJSON, Backbone, _) {


        var socketHotReload = null;

        function getConnection() {

            if (socketHotReload == null) {
                console.log('document.cookie before socketio:', document.cookie);


                socketHotReload = io.connect('http://127.0.0.1:3002');


                socketHotReload.on('error', function socketConnectionErrorCallback(err) {
                    console.error('Unable to connect Socket.IO ---->', JSON.stringify(err));
                });


                socketHotReload.on('connect', function (event) {
                    console.info('successfully established a working and authorized connection'.toUpperCase());
                });


                socketHotReload.on('disconnect', function (event) {
                    console.info('socket disconnected'.toUpperCase());
                });


                socketHotReload.on('hot-reload.ejs', function (data) {

                    window.hotReload([data],function(err,results){

                        var view = viewState.get('headerView');
                        view.template = results[0];
                        view.render();
                    });

                });

                socketHotReload.on('hot-reload.JS', function (data) {

                    alert(data);

                    window.hotReload([data],function(err,results){

                        results[0].render();

                    });

                });

            }

            return socketHotReload;
        }

        function addEvent(eventName, target, callback) {

            getConnection().on(eventName, function () {
                //callback(arguments);
                callback.prototype.apply(target,arguments);
            });

        }

        return {
            getConnection: getConnection,
            addEvent: addEvent
        };
    });

