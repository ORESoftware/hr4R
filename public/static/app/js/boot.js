/**
 * Created by amills001c on 6/10/15.
 */

//TODO: https://quickleft.com/blog/integrating-react-with-backbone/
//TODO: http://stackoverflow.com/questions/19827912/package-html-templates-in-require-js-optimizer
//TODO: http://www.webdeveasy.com/optimize-requirejs-projects/

//define(['jquery','backbone','app/js/routers'], function($,Backbone,routers) {

console.log('loading app/js/BOOT.js');

define('app/js/boot',

    [
        '#appState',
        'jquery',
        'backbone',
        'app/js/giant',
        'app/js/allModels',
        'app/js/allCollections'
    ],

    function (appState, $, Backbone, giant, models, collections) {


        //var router = giant.routers.bootRouter;  //we need to load giant NOW because we need routers to get populated with allViews

        //TODO: might need to figure out how to set ENV before socket.io tries to make connection to server

        var initialize = function () {

            Backbone.history.start();
            //Backbone.history.start({ pushState: true });

            // Require index page from server
            $.ajax({
                url: '/authenticate',
                type: 'GET',
                dataType: 'json',
                success: function (msg) {
                    console.log('authentication message:', msg);
                    //appGlobal.env = msg.env;
                    appState.set('env',msg.env);
                    runApplication(msg.isAuthenticated, msg.user);
                },
                error: function (err) {
                    console.log('server error:', err);
                    setTimeout(function () {
                        alert('server error: ' + String(err));
                    }, 100);
                }
            });
        };

        //TODO: effectiveJS not EmbeddedJS...see google for this
        //TODO: create new user with Backbone model

        var runApplication = function (authenticated, user) {

            function run(){
                if (authenticated === true) {


                    //iterate through all users to find already registered user
                    collections.users.fetch().done(function () {

                        for (var i = 0; i < collections.users.models.length; i++) {

                            if (user.username === collections.users.models[i].get('username')) {
                                //appGlobal.currentUser = collections.users.models[i];
                                appState.set('currentUser',collections.users.models[i]);
                                break;
                            }

                        }

                        if (appState.get('currentUser') === null) {
                            throw new Error('null currentUser');
                        }
                        //window.location.hash='home';
                        //router.navigate('home', {trigger: true});
                        Backbone.Events.trigger('bootRouter', 'home');
                    });
                }
                else {

                    console.log('not authenticated..!');
                    appState.set('currentUser',null);
                    Backbone.Events.trigger('bootRouter', 'index');
                }
            }

            if(appState.get('env') === 'development'){
                loadDefaultUsers(run);
                //run();
            }
            else{
                run();
            }


        };

        function loadDefaultUsers(callback){

            var newUser = models.User.newUser({
                firstName:'default-first-name',
                lastName:'default-last-name',
                username:'default',
                password:'default',
                email:'default@temp.com'
            });

            newUser.persistModel({},{},function(err,model,res,options){
                if(err){
                    throw err;
                }
                else if(res.error){
                    if(typeof res.error === 'object'){
                        //Object.keys(res.error).forEach(function(key){
                        //   console.error('error:',res.error[key]);
                        //});
                        console.log('error:',res.error);
                    }
                    else{
                        console.error('error passed in persistModel callback',res.error);
                    }
                }
                else{
                    //collections.users.add(model);
                    collections.users.add(newUser);
                }
                callback();

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