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
        'underscore',
        '#allCSS',
        'app/js/cssAdder'
    ],

    function (appState, viewState, io, collections, IJSON, Backbone, _, allCSS, cssAdder) {


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


                socketHotReload.on('hot-reload (.ejs)', function (data) {

                    window.hotReloadSimple(data,function(err,result){

                        var view = viewState.get('headerView');
                        view.template = result;
                        view.render();
                    });

                });

                socketHotReload.on('hot-reload (.jsx)', function (data) {

                    alert(data);

                    window.hotReloadSimple(data,function(err,result){


                        require(['#allStandardViews'],function(allStandardViews){
                            allStandardViews['Home'] = result;
                            //Backbone.history.stop();
                            //Backbone.history.start();
                            //Backbone.Events.trigger('bootRouter','home');
                            Backbone.history.loadUrl(Backbone.history.fragment);
                        });

                    });
                });

                socketHotReload.on('hot-reload (.js)', function (data) {

                    alert(data);

                    window.hotReloadSimpleDefine(data,function(err,result){


                        require(['#allStandardViews'],function(allStandardViews){
                            allStandardViews['Home'] = result;
                            //Backbone.history.stop();
                            //Backbone.history.start();
                            //Backbone.Events.trigger('bootRouter','home');
                            Backbone.history.loadUrl(Backbone.history.fragment);
                        });

                    });
                });

                socketHotReload.on('hot-reload (.css)', function (data) {


                    window.hotReloadSimple(data,function(err,result){

                        cssAdder.removeByAttr(data);

                        require(['#allCSS'],function(allCSS){
                            allCSS['cssx/portal/simple-sidebar.css'] = result;
                            //allCSS[5] = result;
                            //allCSS[6] = result;

                            //Backbone.history.stop();
                            //Backbone.history.start();
                            //Backbone.Events.trigger('bootRouter','home');
                            Backbone.history.loadUrl(Backbone.history.fragment);
                        });
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

