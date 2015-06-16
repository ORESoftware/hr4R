/**
 * Created by amills001c on 6/10/15.
 */


//this is a completely single-page-app, so there is only one router


define(['app/js/views/indexView', 'app/js/views/loginView','app/js/views/homeView'], function(IndexView, LoginView, HomeView) {

    var BootRouter = Backbone.Router.extend({

        currentView: null,

        routes: {
            'index':'index',
            'home': 'home',
            'login': 'login',
            "*actions": "defaultRoute" // Backbone will try to match the routes above first
        },

        changeView: function(view) {
            if(this.currentView != null){
                this.currentView.undelegateEvents();
            }
            this.currentView = view;
            console.log('current view:',view);
            this.currentView.render();
        },

        home: function() {
            this.changeView(new HomeView());
        },

        //login: function() {
        //    this.changeView(loginView);
        //},

        index: function() {
            this.changeView(new IndexView());
        }
    });

    bootRouter = new BootRouter();

    bootRouter.on('route:defaultRoute', function (actions) {
        console.log( 'default route invoked...' + actions );
    });



    return {
        bootRouter: bootRouter
    }
});