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
        'app/js/viewState',
        'ijson'
    ],

    function (async, collections, $viewState, IJSON) {

        var allViews = null;

        var BootRouter = Backbone.Router.extend({

            //currentView: require('app/js/currentView'),

            viewState: $viewState,

            routes: {
                'index': 'index',
                'home': 'home',
                'login': 'login',
                "*notFound": "defaultRoute" // Backbone will try to match the routes above first
            },

            initialize: function () {

                //_.bind(this.initialize,undefined);
                _.bindAll(this, 'changeView');


            },

            destroyView: function (view) {

                view.undelegateEvents();
                view.$el.removeData().unbind();
                view.stopListening();
                //view.remove(); //this deletes DOM element from the DOM, and that is bad
                //Backbone.View.prototype.remove.call(view);

            },


            changeView: function (view) {

                //we should sync all collections here before switching views

                var self = this;

                var collectionsToSync = [];

                Object.keys(collections).forEach(function (key) {
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

                async.parallel(collectionsToSync,
                    function final(err, results) {
                        if (err) {
                            onError(err);
                        }
                        else {
                            //continueOn(self);//continueOn().bind(self);//var func = continueOn.bind(self);//func();
                            continueOn.bind(self)(view); //bind continueOn function self and then call continueOn()
                        }

                    }
                );

                function onError(err) {
                    alert('there was an error --->' + err + 'could not change the view.');
                }

             /*   function continueOn(self) {
                    if (appGlobal.currentUser == null || appGlobal.authorized === false) {

                        if (this.viewState.get('mainView') != null) {
                            //this.destroyView(this.viewState.get('mainView'));
                        }
                        this.viewState.set('mainView', new allViews.Index());
                        this.viewState.get('mainView').render();
                        window.location.hash = 'index';
                        console.log('current main view was switched to index view because no user was logged in.');

                        if (this.viewState.get('footerView') == null) {
                            this.viewState.set('footerView', new allViews.Footer());
                        }
                        if (this.viewState.get('headerView') == null) {
                            this.viewState.set('headerView', new allViews.Header());
                        }
                        this.viewState.get('footerView').render();
                        this.viewState.get('headerView').render();

                    }
                    else { //user is authenticated/authorized

                        //console.log(IJSON.parse(localStorage.getItem('sc_admin_user')));

                        console.log(localStorage.getItem('sc_admin_user'));

                        if (this.viewState.get('mainView') != null) {
                            //this.destroyView(this.viewState.get('mainView'));
                        }
                        this.viewState.set('mainView', view);
                        console.log('current main view:', view);
                        this.viewState.get('mainView').render();
                        if (this.viewState.get('footerView') == null) {
                            this.viewState.set('footerView', new allViews.Footer());
                        }
                        if (this.viewState.get('headerView') == null) {
                            this.viewState.set('headerView', new allViews.Header());
                        }
                        this.viewState.get('footerView').render();
                        this.viewState.get('headerView').render();
                    }
                }*/
            },

            home: function () {
                this.changeView(new allViews.Home());
            },

            index: function () {
                this.changeView(new allViews.Index());
            },

            defaultRoute: function(){
                //this.changeView(new allViews.Home());
                this.navigate('home', {trigger: true});
            //    TODO: fix this so that if user puts in unknown route into address bar, that it goes to home
            }
        });

        //TODO: ejs.update()

        var bootRouter = new BootRouter();

        //bootRouter.on('route:defaultRoute', function (actions) {
        //    console.log('default route invoked...' + actions);
        //
        //    //TODO: catch route that was not recognized
        //
        //    continueOn.bind(this)();
        //});


        function continueOn($view) {


            if (appGlobal.currentUser == null || appGlobal.authorized === false) {

                if (this.viewState.get('mainView') != null) {
                    //this.destroyView(this.viewState.get('mainView'));
                }
                this.viewState.set('mainView', new allViews.Index());
                this.viewState.get('mainView').render();
                window.location.hash = 'index';
                console.log('current main view was switched to index view because no user was logged in.');

                if (this.viewState.get('footerView') == null) {
                    this.viewState.set('footerView', new allViews.Footer());
                }
                if (this.viewState.get('headerView') == null) {
                    this.viewState.set('headerView', new allViews.Header());
                }
                this.viewState.get('footerView').render();
                this.viewState.get('headerView').render();

            }
            else { //user is authenticated/authorized

                //console.log(IJSON.parse(localStorage.getItem('sc_admin_user')));

                var view = null;
                if($view == null){
                    throw new Error('null view in router');
                }else{
                    view = $view;
                }

                    console.log(localStorage.getItem('sc_admin_user'));

                    if (this.viewState.get('mainView') != null) {
                        //this.destroyView(this.viewState.get('mainView'));
                    }
                    this.viewState.set('mainView', view);
                    console.log('current main view:', view);
                    this.viewState.get('mainView').render();
                    if (this.viewState.get('footerView') == null) {
                        this.viewState.set('footerView', new allViews.Footer());
                    }
                    if (this.viewState.get('headerView') == null) {
                        this.viewState.set('headerView', new allViews.Header());
                    }
                    this.viewState.get('footerView').render();
                    this.viewState.get('headerView').render();
                }
            //}
        }







        return function ($allViews) {

            if (allViews === null) {
                if ($allViews == null) {
                    //throw new Error('null value to passed routers.js');
                    console.log('null/undefined value to passed routers.js');
                }
                console.log('initializing routers with allViews');
                allViews = $allViews;
            }

            return {
                bootRouter: bootRouter
            }
        }
    });