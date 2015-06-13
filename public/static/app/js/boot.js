/**
 * Created by amills001c on 6/10/15.
 */


define(['jquery','backbone','app/js/routers'], function($,Backbone,routers) {

    var router = routers.bootRouter;

    var initialize = function() {
        // Require home page from server
        $.ajax({
            url: '/authenticate',
            type: 'GET',
            dataType: 'json',
            success: function(msg) {
                console.log('authentication message:',msg);
                runApplication(true);
            },
            error: function(err) {
                console.log('authentication error:',err);
                setTimeout(function(){
                    alert('authentication error: '+String(err));
                },100);
                runApplication(false);
            }
        });
    };

    var runApplication = function(authenticated) {

        // Authenticated user move to home page
        if(authenticated) {
            window.location.hash='home';
            console.log('authenticated!!');
            //router.navigate('home', {trigger: true});
        }
        else {
            //window.location.hash='login';
            console.log('not authenticated..!');
            window.location.hash='index';
            //router.navigate('index', {trigger: true});
        }
        Backbone.history.start();
    }

    return {
        initialize: initialize
    };
});