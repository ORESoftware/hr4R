/**
 * Created by amills001c on 6/10/15.
 */

//TODO: https://quickleft.com/blog/integrating-react-with-backbone/
//TODO: http://stackoverflow.com/questions/19827912/package-html-templates-in-require-js-optimizer
//TODO: http://www.webdeveasy.com/optimize-requirejs-projects/
//TODO: react templates - http://wix.github.io/react-templates/
//TODO: http://wix.github.io/react-templates/fiddle.html
//TODO: browser cache re-validation - http://stackoverflow.com/questions/49547/making-sure-a-web-page-is-not-cached-across-all-browsers


console.log('loading app/js/boot.js');

define(
    [
        'async',
        '+appState',
        '@oplogSocketClient',
        'app/js/cssAdder',
        '#allModels',
        '#allCollections',
        '#allTemplates',
        '#allControllers',
        '#allViews',
        '#allCSS',
        '#allFluxActions',
        '#allFluxConstants',
        '@Router',
        '@eventBus'
    ],

    /*
     we don't use the majority of these dependencies in this file, but they are loaded here so that (1) r.js can build
     the optimized file, and (2) so that we can do synchronous requires later on in our application
     */

    function (async, appState, osc, cssAdder,
              allModels, allCollections, allTemplates, allControllers, allViews, allCSS, allFluxActions, allFluxConstants,
              router, eventBus) {

        //TODO: might need to figure out how to set ENV before socket.io tries to make connection to server

        var initialize = function () {

            console.log('Boot.initialize() fired', (Date.now() - window.startDate));

            //Backbone.history.start();
            //Backbone.history.start({ pushState: true });

            $.ajax({
                url: '/authenticate',
                type: 'GET',
                dataType: 'json',
                success: function (msg) {
                    console.log('authentication message:', msg);

                    console.log('boot.initialize() waiting for document.ready to fire, time:', (Date.now() - window.startDate));

                    $(function () {
                        //window.documentIsReady = true;
                        console.log('document.ready fired, time:', (Date.now() - window.startDate));
                        runApplication(msg);
                    });
                },
                error: function (err) {
                    console.log('server error:', err);
                    alert('server error: ' + String(err));

                }
            });

            //require(['jqueryUI_CSS','jqueryUI_smooth'],function(jqueryUI_CSS,jqueryUI_smooth){
            //    //add css while we are waiting...
            //    var css = [
            //        allCSS['cssx/portal/simple-sidebar.css'],
            //        allCSS['cssx/bootstrap/bootstrap-notify.css'],
            //        //allCSS['cssx/pictureList/pictureList.css']
            //        //jqueryUI_CSS,
            //        //jqueryUI_smooth
            //    ];
            //
            //    cssAdder.addAllVia(css, true);
            //});

            //add css while we are waiting...
            var css = [
                allCSS['cssx/portal/simple-sidebar.css'],
                allCSS['cssx/bootstrap/bootstrap-notify.css']
                //allCSS['cssx/pictureList/pictureList.css']
            ];

            cssAdder.addAllVia(css, true);


        };

        //TODO: http://superuser.com/questions/205223/pros-and-cons-of-bzip-vs-gzip
        //TODO: effectiveJS not EmbeddedJS...see google for this

        var runApplication = function (msg) {

            console.log('runApplication fired, Backbone History starting', (Date.now() - window.startDate));

            appState.set('env', msg.env);

            var authenticated = msg.isAuthenticated;
            var user = msg.user;

            Backbone.history.start();

            var useSocketServer = msg.useSocketServer ? true : false;
            saveToLocalStorage('use_socket_server', useSocketServer);
            var useHotReloader = msg.useHotReloader ? true : false;
            saveToLocalStorage('use_hot_reloader', useHotReloader);


            function run() {

                if (authenticated === true) {

                    //iterate through all users to find already registered user
                    allCollections.users.fetch().done(function () {

                        for (var i = 0; i < allCollections.users.models.length; i++) {

                            if (user.username === allCollections.users.models[i].get('username')) {
                                //appGlobal.currentUser = collections.users.models[i];
                                appState.set('currentUser', allCollections.users.models[i]);
                                break;
                            }

                        }

                        if (appState.get('currentUser') === null) {
                            throw new Error('null currentUser');
                        }

                        if(readFromLocalStorage('use_socket_server')){
                            osc.getSocketIOConn();
                        }
                        var hash = readFromLocalStorage('original_hash_request');
                        eventBus.trigger('bootRouter', hash);
                    });
                }
                else {

                    console.log('not authenticated..!');
                    appState.set('currentUser', null);
                    eventBus.trigger('bootRouter', 'index');
                }
            }

            console.log('APPLICATION ENVIRONMENT:', appState.get('env'));

            if (appState.get('env') === 'development') {
                require(['app/js/hot-reloading/hotReloadHandler'], function (hrh) {
                    if(readFromLocalStorage('use_hot_reloader')){
                        hrh.getConnection();
                    }
                    loadDefaultModels(run);
                });
            }
            else {
                run();
            }
        };

        function loadDefaultModels(callback) {

            var models = [

                allModels.User.newUser({
                    firstName: 'default-first-name',
                    lastName: 'default-last-name',
                    username: 'default',
                    password: 'default',
                    email: 'default@temp.com'
                }, {collection: allCollections.users}),

                allModels.User.newUser({
                    firstName: '2default-first-name2',
                    lastName: '2default-last-name2',
                    username: '2default2',
                    password: '2default2',
                    email: '2default@temp.com'
                }, {collection: allCollections.users}),


                allModels.User.newUser({
                    firstName: '3default-first-name3',
                    lastName: '3default-last-name3',
                    username: '3default3',
                    password: '3default3',
                    email: '3default@temp.com'
                }),

                allModels.Job.newJob({
                    firstName: 'rand-job-name',
                    lastName: 'rand-last-name',
                    firstName: 'rando first',
                    jobName: 'jobbyname'
                }, {collectionName: 'jobs'})
                ,

                allModels.Job.newJob({
                    firstName: '2rand-job-name2',
                    lastName: '2rand-last-name2',
                    animals: {birds: true, donkeys: true, rats: true},
                    jobName: '2jobbyname2'
                }, {collectionName: 'jobs'}),

                allModels.Job.newJob({
                    firstName: '3rand-job-name3',
                    lastName: '3rand-last-name3',
                    animals: {cats: true, dogs: true, fish: true, mice: true},
                    jobName: '3jobbyname3'
                }, {})
            ];

            async.series([
                    function saveModels(cb) {

                        async.each(models, function (model, cb) {
                                model.persistModel({}, {}, function (err, model, res, options) {
                                    if (err) {
                                        throw err;
                                    }
                                    else if (res.error) {
                                        console.error('error passed in persistModel callback', res.error);
                                        cb();
                                    }
                                    else {
                                        //collections.users.add(model);
                                        //collections.users.add(newUser);
                                        model.collection.add(model);
                                        cb();
                                    }
                                });
                            },
                            function done(err) {
                                cb(err);
                            });
                    },

                    function batchSaveCollection(cb) {
                        allCollections.jobs.persistCollectionBatch({}, function (err, results) {
                            cb(err, results);
                        })
                    }],

                function done(err, results) {
                    if (err) {
                        throw err;
                    }
                    else {
                        console.log(results);
                        callback(null);
                    }

                });

        }

        return {
            initialize: initialize
        };
    },


    function (error) {  //this is called an "errback"
        console.log('Custom error-back handler', error);
        //error.requireModules : is Array of all failed modules
        var failedId = error.requireModules && error.requireModules[0];
        console.log(failedId);
        console.log(error.message);
    });