/**
 * Created by amills001c on 6/10/15.
 */


define(['jquery','backbone','app/js/routers'], function($,Backbone,routers) {

    var router = routers.bootRouter;

    var initialize = function() {
        // Require home page from server
        $.ajax({
            url: '/home',
            type: 'GET',
            dataType: 'json',
            success: function() {
                runApplication(true);
            },
            error: function() {
                runApplication(false);
            }
        });
    };

    var runApplication = function(authenticated) {

        // Authenticated user move to home page
        if(authenticated) {
            //window.location.hash='home';
            router.navigate('home', {trigger: true});
        }
        else {
            //window.location.hash='login';
            console.log('not authenticated..!');
            router.navigate('login', {trigger: true});
        }
        Backbone.history.start();
    }

    return {
        initialize: initialize
    };
});