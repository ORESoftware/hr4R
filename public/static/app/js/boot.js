/**
 * Created by amills001c on 6/10/15.
 */

//TODO: https://quickleft.com/blog/integrating-react-with-backbone/
//TODO: http://stackoverflow.com/questions/19827912/package-html-templates-in-require-js-optimizer
//TODO: http://www.webdeveasy.com/optimize-requirejs-projects/

//TODO: react templates - http://wix.github.io/react-templates/
//TODO: http://wix.github.io/react-templates/fiddle.html

//TODO: browser cache re-validation - http://stackoverflow.com/questions/49547/making-sure-a-web-page-is-not-cached-across-all-browsers


//define(['jquery','backbone','app/js/routers'], function($,Backbone,routers) {

console.log('loading app/js/BOOT.js');

define('app/js/boot',

    [
        '#appState',
        'jquery',
        'backbone',
        'app/js/giant',
        '#allModels',
        '#allCollections',
        'app/js/models/NestedModel',
        'app/js/cssAdder',
        '#allCSS'
    ],

    function (appState, $, Backbone, giant, allModels, allCollections, NestedModel, cssAdder, allCSS) {

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
                    //appGlobal.env = msg.env;
                    appState.set('env', msg.env);
                    console.log('boot.initialize() waiting for document.ready to fire, time:', (Date.now() - window.startDate));

                    var x = allCSS['text!cssx/portal/simple-sidebar.css'];
                    //var y = allCSS['text!cssx/bootstrap/bootstrap-notify.css'];

                    cssAdder.add(x);
                    //cssAdder.add(y);

                    $(function () {
                        window.documentIsReady = true;
                        console.log('document.ready fired, time:', (Date.now() - window.startDate));
                        runApplication(msg.isAuthenticated, msg.user);
                    });
                },
                error: function (err) {
                    console.log('server error:', err);
                    setTimeout(function () {
                        alert('server error: ' + String(err));
                    }, 100);
                }
            });


            //$(function () {
            //    window.documentIsReady = true;
            //    //                console.log('document.ready fired, time:', (Date.now() - window.startDate));
            //    //                runApplication(msg.isAuthenticated, msg.user);
            //    runApplication(false, null);
            //});


        };

        //TODO: does optimized.js.gz file take longer to parse?
        //TODO: http://superuser.com/questions/205223/pros-and-cons-of-bzip-vs-gzip
        //TODO: effectiveJS not EmbeddedJS...see google for this
        //TODO: create new user with Backbone model

        var runApplication = function (authenticated, user) {

            console.log('runApplication fired, Backbone History starting', (Date.now() - window.startDate));

            Backbone.history.start();

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
                        //window.location.hash='home';
                        //router.navigate('home', {trigger: true});
                        //Backbone.Events.trigger('bootRouter', 'home');
                        giant.getSocketIOConn();
                        var hash = readFromLocalStorage('original_hash_request');
                        Backbone.Events.trigger('bootRouter', hash);
                    });
                }
                else {

                    console.log('not authenticated..!');
                    appState.set('currentUser', null);
                    Backbone.Events.trigger('bootRouter', 'index');
                }
            }

            console.log('APPLICATION ENVIRONMENT:', appState.get('env'));
            if (appState.get('env') === 'development') {
                loadDefaultModels(run);
            }
            else {
                run();
            }


        };

        function loadDefaultModels(callback) {

            //var models = [
            //
            //    allModels.User.newUser({
            //        firstName: 'default-first-name',
            //        lastName: 'default-last-name',
            //        username: 'default',
            //        password: 'default',
            //        email: 'default@temp.com'
            //    }),
            //
            //    allModels.Job.newJob({
            //        firstName: 'rand-job-name',
            //        lastName: 'rand-last-name',
            //        firstName: 'rando first',
            //        jobName: 'jobbyname'
            //    })
            //];

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
                    animals: new NestedModel({}),
                    jobName: '2jobbyname2'
                }, {collectionName: 'jobs'}),

                allModels.Job.newJob({
                    firstName: '3rand-job-name3',
                    lastName: '3rand-last-name3',
                    animals: new NestedModel({}),
                    jobName: '3jobbyname3'
                }, {})
            ];

            models.forEach(function (model, index) {
                model.persistModel({}, {}, function (err, model, res, options) {
                    if (err) {
                        throw err;
                    }
                    else if (res.error) {
                        if (typeof res.error === 'object') {
                            //Object.keys(res.error).forEach(function(key){
                            //   console.error('error:',res.error[key]);
                            //});
                            console.log('error:', res.error);
                        }
                        else {
                            console.error('error passed in persistModel callback', res.error);
                        }
                    }
                    else {
                        //collections.users.add(model);
                        //collections.users.add(newUser);
                        model.collection.add(model);
                    }
                    callback();

                });
            });


        }

        return {
            initialize: initialize
        };
    },


    function (error) {  //this is called an "errback"
        console.log('Custom ERROR handler', error);
        //error.requireModules : is Array of all failed modules
        var failedId = error.requireModules && error.requireModules[0];
        console.log(failedId);
        console.log(error.message);
    });