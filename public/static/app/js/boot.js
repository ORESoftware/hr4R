/**
 * Created by amills001c on 6/10/15.
 */

var app = app || {};

define(['jquery','backbone','app/js/routers'], function($,Backbone,routers) {

    var router = app.router = routers.bootRouter;

    var initialize = function() {

        Backbone.history.start();
        // Require index page from server
        $.ajax({
            url: '/authenticate',
            type: 'GET',
            dataType: 'json',
            success: function(msg) {
                console.log('authentication message:',msg);
                runApplication(msg.msg); //msg.msg is boolean value sent from server, representing user authentication, yes or no
            },
            error: function(err) {
                console.log('server error:',err);
                setTimeout(function(){
                    alert('server error: '+String(err));
                },100);
            }
        });
    };

    //TODO: create new user with Backbone model

    var runApplication = function(authenticated) {

        // Authenticated user move to home page
        if(authenticated) {
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
});