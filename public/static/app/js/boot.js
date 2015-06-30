/**
 * Created by amills001c on 6/10/15.
 */

//var app = app || {};

//define(['jquery','backbone','app/js/routers'], function($,Backbone,routers) {

console.log('loading app/js/BOOT.js');

define('app/js/boot',

    [
        'jquery',
        'backbone',
        'app/js/giant',
        'app/js/collections'
    ],

    function ($, Backbone, giant,collections) {


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
                    appGlobal.env = msg.env;
                    runApplication(msg.isAuthenticated,msg.user);
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

        var runApplication = function (authenticated,user) {

            if (authenticated === true) {
                //window.location.hash='home';//Backbone.history.navigate('home', true);
                console.log('authenticated!!');

                collections.users.fetch().done(function () {

                    for (var i = 0; i < collections.users.models.length; i++) {

                        if (user.username === collections.users.models[i].get('username')) {
                            appGlobal.currentUser = collections.users.models[i];
                            break;
                        }

                    }

                    if (appGlobal.currentUser === null) {
                        throw new Error('null appGlobal.currentUser');
                    }
                    //window.location.hash='home';
                    //router.navigate('home', {trigger: true});
                    Backbone.Events.trigger('bootRouter','home');
                });
            }
            else {
                //window.location.hash='login';
                console.log('not authenticated..!');
                //window.location.hash='index';
                //Backbone.history.navigate('index', true);
                //router.navigate('index', {trigger: true});
                Backbone.Events.trigger('bootRouter','index');
            }
        };

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