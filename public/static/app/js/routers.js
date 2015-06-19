/**
 * Created by amills001c on 6/10/15.
 */


//this is a completely single-page-app, so there is only one router

console.log('loading app/js/ROUTERS.js');

//define(['app/js/currentView'],function($currentView) {

//define('app/js/routers',['require'],function(require) {

define('app/js/routers',['app/js/currentView'],function($currentView) {

//define(['require','app/js/allViews'], function(require) {
    //var allViews = require('app/js/allViews');
    //var IndexView = allViews.Index;
    //var LoginView = allViews.Login;
    //var HomeView = allViews.Home;
    //var HeaderView = allViews.Header;
    //var FooterView = allViews.Footer;

    var allViews = null;

    var BootRouter = Backbone.Router.extend({

        //currentView: require('app/js/currentView'),

        currentView: $currentView,

        routes: {
            'index':'index',
            'home': 'home',
            'login': 'login',
            "*actions": "defaultRoute" // Backbone will try to match the routes above first
        },

        //changeView: function(view) {
        //    if(this.currentView.get('mainView') != null){
        //        this.currentView.get('mainView').undelegateEvents();
        //    }
        //    this.currentView.set('mainView',view);
        //    console.log('current main view:',view);
        //    this.currentView.get('mainView').render();
        //    if(this.currentView.get('footerView') == null){
        //        this.currentView.set('footerView',new allViews.Footer());
        //    }
        //    if(this.currentView.get('headerView') == null){
        //        this.currentView.set('headerView',new allViews.Header());
        //    }
        //    this.currentView.get('footerView').render();
        //    this.currentView.get('headerView').render();
        //
        //},

        changeView: function(view) {
            if($currentView.get('mainView') != null){
                $currentView.get('mainView').undelegateEvents();
            }
            $currentView.set('mainView',view);
            console.log('current main view:',view);
            $currentView.get('mainView').render();
            if($currentView.get('footerView') == null){
                $currentView.set('footerView',new allViews.Footer());
            }
            if($currentView.get('headerView') == null){
                $currentView.set('headerView',new allViews.Header());
            }
            $currentView.get('footerView').render();
            $currentView.get('headerView').render();

        },

        home: function() {
            this.changeView(new allViews.Home());
        },

        index: function() {
            this.changeView(new allViews.Index());
        }
    });

    //TODO: ejs.update()
    //TODO: http://danhough.com/blog/backbone-view-inheritance/

    var bootRouter = new BootRouter();

    bootRouter.on('route:defaultRoute', function (actions) {
        console.log( 'default route invoked...' + actions );
    });

    return function($allViews) {

        if(allViews === null){
            if($allViews == null){
                //throw new Error('null value to passed routers.js');
                console.log('null value to passed routers.js');
            }
            console.log('initializing routers with allViews');
            allViews = $allViews;
        }

        return{
            bootRouter: bootRouter
        }
    }
});