/**
 * Created by amills001c on 6/10/15.
 */


//this is a completely single-page-app, so there is only one router

console.log('loading app/js/ROUTERS.js');

//define(['app/js/currentView'],function($currentView) {

//define('app/js/routers',['require'],function(require) {

define('app/js/routers',

    [
        'async',
        'app/js/collections',
        'app/js/currentView'
    ],

    function (async, collections, $currentViews) {


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

            currentView: $currentViews,

            routes: {
                'index': 'index',
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

            changeView: function (view) {



                //we should sync all collections here before switching views

                var collectionsToSync = [];

                //for (var key in collections) {

                    //if(!collections.hasOwnProperty(key)){
                    //    continue;
                    //}

                Object.keys(collections).forEach(function(key){
                    if (collections.hasOwnProperty(key)) {
                        collectionsToSync.push(function (cb) {
                            var coll = collections[key];
                            coll.persist(function (err, res) {
                                coll.fetch().done(function () {
                                    cb();
                                });
                            });
                        })
                    }
                });


                //}

                async.parallel(collectionsToSync,
                    function final(err, results) {
                        if (err) {
                            onError(err);
                        }
                        else {
                            continueOn();
                        }

                    }
                );

                function onError(err) {
                    alert('there was an error --->' + err + 'could not change the view.');
                }

                function continueOn() {
                    if (!(appGlobal.currentUser !== null && appGlobal.authorized === true)) {

                        if ($currentViews.get('mainView') != null) {
                            $currentViews.get('mainView').undelegateEvents();
                        }
                        $currentViews.set('mainView', new allViews.Index());
                        window.location.hash = 'index';
                        console.log('current main view was switched to index view because no user was logged in.');
                        $currentViews.get('mainView').render();
                        if ($currentViews.get('footerView') == null) {
                            $currentViews.set('footerView', new allViews.Footer());
                        }
                        if ($currentViews.get('headerView') == null) {
                            $currentViews.set('headerView', new allViews.Header());
                        }
                        $currentViews.get('footerView').render();
                        $currentViews.get('headerView').render();

                    }
                    else {

                        if ($currentViews.get('mainView') != null) {
                            $currentViews.get('mainView').undelegateEvents();
                        }
                        $currentViews.set('mainView', view);
                        console.log('current main view:', view);
                        $currentViews.get('mainView').render();
                        if ($currentViews.get('footerView') == null) {
                            $currentViews.set('footerView', new allViews.Footer());
                        }
                        if ($currentViews.get('headerView') == null) {
                            $currentViews.set('headerView', new allViews.Header());
                        }
                        $currentViews.get('footerView').render();
                        $currentViews.get('headerView').render();
                    }
                }
            },

            home: function () {
                this.changeView(new allViews.Home());
            },

            index: function () {
                this.changeView(new allViews.Index());
            }
        });

        //TODO: ejs.update()

        var bootRouter = new BootRouter();

        bootRouter.on('route:defaultRoute', function (actions) {
            console.log('default route invoked...' + actions);
        });

        return function ($allViews) {

            if (allViews === null) {
                if ($allViews == null) {
                    //throw new Error('null value to passed routers.js');
                    console.log('null value to passed routers.js');
                }
                console.log('initializing routers with allViews');
                allViews = $allViews;
            }

            return {
                bootRouter: bootRouter
            }
        }
    });