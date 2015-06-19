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
        'app/js/giant'
    ],

    function ($, Backbone, giant) {


        var router = giant.routers.bootRouter;  //we need to load giant NOW because we need routers to get populated with allViews

        var initialize = function () {

            Backbone.history.start();
            // Require index page from server
            $.ajax({
                url: '/authenticate',
                type: 'GET',
                dataType: 'json',
                success: function (msg) {
                    console.log('authentication message:', msg);

                    appGlobal.currentUser = msg.user;
                    runApplication(msg.isAuthenticated); //msg.msg is boolean value sent from server, representing user authentication, yes or no
                },
                error: function (err) {
                    console.log('server error:', err);
                    setTimeout(function () {
                        alert('server error: ' + String(err));
                    }, 100);
                }
            });
        };

        //TODO: create new user with Backbone model

        var runApplication = function (authenticated) {

            // Authenticated user move to home page
            if (authenticated === true) {
                //window.location.hash='home';
                console.log('authenticated!!');
                router.navigate('home', {trigger: true});
            }
            else {
                //window.location.hash='login';
                console.log('not authenticated..!');
                //window.location.hash='index';
                router.navigate('index', {trigger: true});
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