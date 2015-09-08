/**
 * Created by amills001c on 6/10/15.
 */


//TODO:http://codebeerstartups.com/2012/12/5-explaining-views-in-backbone-js-learning-backbone-js/
//TODO: http://geeks.bizzabo.com/post/83917692143/7-battle-tested-backbonejs-rules-for-amazing-web-apps
//TODO: do we need "Backbone.history.loadUrl();" or can we just switch views manually
//TODO: http://stackoverflow.com/questions/17796750/why-is-it-considered-bad-practice-to-call-trigger-true-in-the-navigate-function

//this is a completely single-page-app, so there is only one router

console.log('loading app/js/ROUTERS.js');


define(
    [
        '#appState',
        '#viewState',
        'backbone',
        'async',
        '#allCollections',
        'ijson',
        'app/js/cssAdder'
    ],

    function (appState, viewState, Backbone, async, collections, IJSON, cssAdder) {


        var BootRouter = Backbone.Router.extend({

            viewState: viewState,

            routes: {
                '': 'canonical',
                //"+refreshCurrentPage": "refreshCurrentPage",
                "posts/:id": "getPost",
                'books/:id': 'bookScreen',
                'index': 'index',
                'overview': 'overview',
                'home': 'home',
                'userProfile': 'userProfile',
                'pictures': 'pictures',
                'dashboard': 'dashboard',
                'portal': 'portal',
                'login': 'login',
                "lv/:route/:action": "loadView",
                'ctrl/:controller': 'controllerRoute',
                'ctrl/:controller/:action': 'controllerRoute',
                'ctrl/:controller/:action/:id': 'controllerRoute',
                'ctrl/:controller/:action/*id': 'controllerRoute',
                "*notFound": "defaultRoute" // Backbone will try to match the routes above first
            },

            controllerRoute: function (controllerName, actionName, id) {
                //controllerName = controllerName || Config.Defaults.Controller;
                //actionName = actionName || Config.Defaults.Action;

                var self = this;
                require(["app/js/controllers/all/" + controllerName], function (cntr) {
                    //var code = "ctl." + actionName + "();";
                    //eval(code);
                    if (typeof cntr[actionName] === 'function') {
                        cntr[actionName](id, self.changeView);
                    }
                    else {
                        cntr['default'](id, self.changeView);
                    }
                });
            },

            canonical: function () {
                // this is a no operation function
                console.log('hit the canonical route.');
            },

            home: function () {
                var self = this;
                require(['#allCSS', '#allViews'], function (allCSS, allViews) {
                    self.changeView({
                        view: new allViews['standardViews/homeView'](),
                        useSidebar: true,
                        cssAdds: [
                            allCSS['cssx/portal/simple-sidebar.css']
                        ]
                    });
                });
            },

            pictures: function () {
                var self = this;
                require(['#allCSS', '#allViews'], function (allCSS, allViews) {
                    self.changeView({
                        view: new allViews['standardViews/pictureView'](),
                        useSidebar: true,
                        cssAdds: [
                            allCSS['cssx/pictureList/pictureList.css']
                        ]
                    });
                });
            },

            userProfile: function () {
                var self = this;
                require(['#allCSS', '#allViews'], function (allCSS, allViews) {
                    self.changeView({
                        view: new allViews['standardViews/userProfileView'](
                            {
                                model: appState.get('currentUser'),
                                collection: collections.users
                            }
                        ),
                        useSidebar: true
                    });
                });
            },


            index: function () {
                var self = this;
                require(['#allCSS', '#allViews'], function (allCSS, allViews) {
                    self.changeView({
                        view: new allViews['standardViews/IndexView'](
                            {
                                collection: collections.users
                            }
                        ),
                        useSidebar: false
                    });
                });
            },

            dashboard: function () {
                var self = this;
                require(['#allCSS', '#allViews'], function (allCSS, allViews) {
                    self.changeView({
                        view: new allViews['standardViews/dashboardView']({}),
                        useSidebar: true
                    });
                });
            },

            overview: function () {
                var self = this;
                require(['#allCSS', '#allViews'], function (allCSS, allViews) {
                    self.changeView({
                        view: new allViews['standardViews/overviewView'](),
                        useSidebar: true
                    });
                });
            },

            bookScreen: function (id) {
                // Fetch book with `id` and render it.
            },


            defaultRoute: function () {
                alert('route not found so navigating to home view');
                var self = this;
                require(['#allCSS', '#allViews'], function (allCSS, allViews) {
                    self.changeView({
                        view: new allViews['standardViews/homeView'](),
                        useSidebar: true
                    });
                });
            },

            constructor: function () {
                this.givenName = '@BootRouter';
                Backbone.Router.apply(this, arguments);
            },

            initialize: function (options) {

                this.options = options || {};

                var self = this;

                _.bindAll(this, 'changeView', 'destroyView');
                this.listenTo(Backbone.Events, 'bootRouter', onToggleViewRequest);

                function onToggleViewRequest(viewName) {

                    if (window.location.hash && String(window.location.hash).length > 1 && String(window.location.hash).charAt(0) === '#') {
                        var hash = String(window.location.hash).substring(1);
                        console.log('router_hash_request:', hash);
                        saveToLocalStorage('router_hash_request', hash);
                    }
                    else {
                        console.log('no hash in URL seen, setting desired hash to "home"');
                        saveToLocalStorage('router_hash_request', 'home');
                    }

                    self.navigate(viewName, {trigger: true});
                }

                this.listenTo(this, 'all', function (route, action) {
                    console.log('router was invoked, route:', route, 'action:', action);
                });

                //this.on('route:loadView', function (route, action) {
                //    alert(route + "_" + action); //
                //});
                //
                //this.on('route:home', function (actions) {
                //    //alert('Welcome to the SC admin tool.');
                //});
                //
                //this.on('route:getPost', function (id) {
                //    // Note the variable in the route definition being passed in here
                //    alert("Get post number " + id);
                //});

            },

            destroyView: function (view) {

                if (view == null) {
                    console.log('null view sent to destroyView function');
                }
                else {
                    if (view.adhesive) {
                        view.adhesive.unStick();
                    }
                    view.undelegateEvents();
                    view.$el.removeData().unbind();
                    view.stopListening();

                    var cv = view.childViews;


                    Object.keys(cv || {}).forEach(function (key) {
                        this.destroyView(cv[key]);
                    }.bind(this));

                }
                //view.remove(); //this deletes DOM element from the DOM, and that is bad
                //Backbone.View.prototype.remove.call(view);
            },

            //onToggleViewRequest: function (viewName) {
            //    this.navigate(viewName, {trigger: true});
            //},


            changeView: function (opts) {

                //we should sync all collections here before switching views

                var self = this;

                var collectionsToSync = [];

                //TODO: turn these into batch saves

                Object.keys(collections).forEach(function (key) {
                    if (collections.hasOwnProperty(key)) {
                        var coll = collections[key];

                        if (coll.collNeedsPersisting) {
                            collectionsToSync.push(
                                function (cb) {
                                    //TODO: use async.series?
                                    coll.persistCollection({}, function (err, res) {
                                        if (err) {
                                            return cb(err);
                                        }
                                        //TODO: if websockets are on, then shouldn't need to do fetch at all, can just check for connection
                                        //TODO: we should only fetch a collection after it has been persisted and
                                        ////TODO: we only need to fetch a collection if it's needed by the next view
                                        coll.fetch()
                                            .done(function () {
                                                cb();
                                            })
                                            .fail(function (err) {
                                                cb(err);
                                            });
                                    });
                                });
                        }
                        else {
                            collectionsToSync.push(
                                //TODO: if websockets are on, then shouldn't need to do fetch at all, can just check for a current connection
                                function (cb) {
                                    //TODO: we only need to fetch a collection if it's needed by the next view; the collections required by the next view will be passed by the controller
                                    coll.fetch()
                                        .done(function (msg) {
                                            cb(null, msg);
                                        })
                                        .fail(function (err) {
                                            cb(err);
                                        });
                                });
                            console.log('avoiding persisting collection that experienced no changes:', coll);
                        }
                    }
                });

                async.parallel(collectionsToSync,
                    function final(err, results) {
                        if (err) {
                            onError(err);
                        }
                        else {

                            if (!window.documentIsReady) {
                                //here we don't bother rendering stuff before document is ready?
                                return;
                            }
                            else {
                                continueOn.bind(self)(opts);
                            }

                            //$(function() {
                            //    continueOn.bind(self)(opts);
                            //});

                        }
                    }
                );

                function onError(err) {
                    alert('there was an error --->' + err + 'could not change the view.');
                }

            }
        });


        var bootRouter = new BootRouter();

        bootRouter.on('route:getPost', function (id) {
            // Note the variable in the route definition being passed in here
            alert("Get post number " + id);
        });

        //bootRouter.on('route:defaultRoute', function (actions) {
        //    console.log('default route invoked...' + actions);
        //
        //    //TODO: catch route that was not recognized
        //
        //    continueOn.bind(this)();
        //});


        function continueOn(opts) {

            /*

             each controller action has a collection defined for it

             it passes the desired collection to the view

             this also tells the router which new collection it needs to fetch from the server

             the front-end only needs to save the collections that had been changed

             and fetching should only happen for collections that are needed for the next view

             TODO: ejs.update()
             TODO: http://danhough.com/blog/backbone-view-inheritance/

             */


            var self = this;


            cssAdder.removeAllTempCSS();


            if (!appState.currentUserSessionIsOK()) {
                if (this.viewState.get('mainView') != null) {
                    this.destroyView(this.viewState.get('mainView'));
                }
                if (this.viewState.get('mainParentView') != null) {
                    this.destroyView(this.viewState.get('mainParentView'));
                }

                require(['#allViews'], function (allViews) {

                    self.viewState.set('mainView', new allViews['standardViews/IndexView']());
                    window.location.hash = 'index'; //TODO why do we need this line?

                    if (self.viewState.get('footerView') == null) {
                        self.viewState.set('footerView', new allViews['standardViews/footerView']());
                    }
                    if (self.viewState.get('headerView') == null) {
                        self.viewState.set('headerView', new allViews['standardViews/headerView']());
                    }
                    self.viewState.get('headerView').render();

                    $('#main-div-id').html(self.viewState.get('mainView').render().el);
                    //self.viewState.get('mainView').render(function () {
                    //    $('#main-div-id').html(self.viewState.get('mainView').el);
                    //});

                    self.viewState.get('footerView').render();
                });


            }
            else { //user is authenticated/authorized

                var view = opts.view;
                if (view == null) {
                    throw new Error('null view in router');
                }

                require(['#allViews', '#allTemplates'], function (allViews, allTemplates) {

                    //we can do dependency injection by passing allViews and allTemplates to render function of Backbone

                    if (opts.useSidebar === true) {
                        //this.destroyView(this.viewState.get('mainParentView'));
                        self.viewState.set('mainParentView', new allViews['standardViews/portalView']());
                        var temp = self.viewState.get('mainParentView');
                        temp.render();
                    }
                    else {
                        self.destroyView(self.viewState.get('mainParentView'));
                        self.viewState.set('mainParentView', null);
                    }

                    if (self.viewState.get('mainView') != null) {
                        self.destroyView(self.viewState.get('mainView'));
                        self.viewState.get('mainView').remove();
                    }
                    self.viewState.set('mainView', view);

                    var collection = view.collection;
                    var model = view.model;

                    if (appState.get('env') === 'development') {
                        window.currentModel = model;
                        window.currentCollection = collection;
                    }

                    self.viewState.set('footerView', new allViews['standardViews/footerView']({
                        model: model,
                        collection: collection
                    }));


                    self.viewState.set('headerView', new allViews['standardViews/headerView']());


                    //**add stylesheets
                    cssAdder.addAllVia(opts.cssAdds || []);

                    //**render header**
                    self.viewState.get('headerView').render();

                    //**render mainView**
                    if (self.viewState.get('mainView').givenName !== '@IndexView') {
                        $('#main-content-id').html(self.viewState.get('mainView').render().el);
                    }
                    else {
                        $('#main-div-id').html(self.viewState.get('mainView').render().el);
                    }

                    //if (self.viewState.get('mainView').givenName !== '@IndexView') {
                    //    self.viewState.get('mainView').render(function(){
                    //        $('#main-content-id').html(self.viewState.get('mainView').el)
                    //    });
                    //}
                    //else {
                    //    self.viewState.get('mainView').render(function(){
                    //        $('#main-div-id').html(self.viewState.get('mainView').el);
                    //    });
                    //}


                    //**render footer**
                    self.viewState.get('footerView').render();

                });
            }
        }


        return {
            bootRouter: bootRouter
        }
    });
