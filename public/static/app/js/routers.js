/**
 * Created by amills001c on 6/10/15.
 */


define(['views/index', 'views/login'], function(indexView, loginView) {

    var BootRouter = Backbone.Router.extend({

        currentView: null,

        routes: {
            'home': 'home',
            'login': 'login'
        },

        changeView: function(view) {
            if(this.currentView != null){
                this.currentView.undelegateEvents();
            }
            this.currentView = view;
            this.currentView.render();
        },

        home: function() {
            this.changeView(indexView);
        },

        login: function() {
            this.changeView(loginView);
        }
    });

    return {
        bootRouter: new BootRouter()
    }
});