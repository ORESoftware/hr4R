/**
 * Created by amills001c on 6/10/15.
 */


//TODO:http://codebeerstartups.com/2012/12/5-explaining-views-in-backbone-js-learning-backbone-js/
//TODO: http://geeks.bizzabo.com/post/83917692143/7-battle-tested-backbonejs-rules-for-amazing-web-apps
//TODO: do we need "Backbone.history.loadUrl();" or can we just switch views manually
//TODO: http://stackoverflow.com/questions/17796750/why-is-it-considered-bad-practice-to-call-trigger-true-in-the-navigate-function

//this is a completely single-page-app, so there is only one router
console.log('loading app/js/router.js');

define(
    [
        '+appState',
        '+viewState',
        'async',
        '#allCollections',
        'app/js/cssAdder',
        'react',
        '@eventBus'
    ],

    function (appState, viewState, async, allCollections, cssAdder, React, eventBus) {


        var BootRouter = Backbone.Router.extend({

            routes: {
                '': 'canonical',
                'index': 'index',
                'overview': 'overview',
                'home': 'home',
                'userProfile': 'userProfile',
                'pictures': 'pictures',
                'dashboard': 'dashboard',
                'portal': 'portal',
                'login': 'login',
                'ctrl/:controller': 'controllerRoute',
                'ctrl/:controller/:action': 'controllerRoute',
                'ctrl/:controller/:action/:id': 'controllerRoute',
                'ctrl/:controller/:action/*id': 'controllerRoute',
                "*notFound": "defaultRoute" // Backbone will try to match the routes above first
            },

            controllerRoute: function (controllerName, actionName, id) {

                var self = this;
                require(['app/js/controllers/all/' + controllerName], function (cntr) {
                        if (typeof cntr[actionName] === 'function') {
                            cntr[actionName](id, self.changeView);
                        }
                        else {
                            cntr['default'](id, self.changeView);
                        }
                    },
                    function (err) {
                        //route was not found, navigate home
                        console.error('route was not found' + String(err));
                        alert('route was not found' + String(err));
                        //Backbone.Events.trigger('bootRouter','home');
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
                                collection: allCollections.users
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
                                collection: allCollections.users
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

                this.listenTo(eventBus, 'bootRouter', function onToggleViewRequest(viewName) {

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
                });

                this.listenTo(this, 'all', function (route, action) {
                    console.log('router was invoked, route:', route, 'action:', action);
                });

            },

            destroyView: function (view) {

                if (view == null) {
                    console.log('null view sent to destroyView function');
                }
                else {
                    if (view.adhesive) {
                        view.adhesive.unStick();
                    }

                    //remove all React components
                    (view.nodes || []).forEach(function (node) {
                        try {
                            var result = React.unmountComponentAtNode($(view.el).find(node)[0]);
                            console.log('node=', node, 'result=', result);
                        }
                        catch (err) {
                            console.error(err);
                        }
                    });

                    view.undelegateEvents();
                    view.$el.removeData().unbind();
                    view.stopListening();


                    var cv = view.childViews;


                    Object.keys(cv || {}).forEach(function (key) {
                        this.destroyView(cv[key]);
                    }.bind(this));

                }
            },

            changeView: function (opts) {

                //sync all collections here before switching views

                var self = this;

                var collectionsToSync = [];

                //TODO: turn these into batch saves

                Object.keys(allCollections).forEach(function (key) {
                    if (allCollections.hasOwnProperty(key)) {
                        var coll = allCollections[key];

                        if (coll.collNeedsPersisting) {
                            collectionsToSync.push(
                                function (cb) {
                                    //TODO: use async.series?
                                    //TODO: if websockets are on, then shouldn't need to do fetch at all, can just check for connection
                                    //TODO: we should only fetch a collection after it has been persisted and
                                    ////TODO: we only need to fetch a collection if it's needed by the next view
                                    coll.persistCollection({}, function (err, res) {
                                        if (err) {
                                            cb(err);
                                        }
                                        else {
                                            coll.fetchOptimized(function (err) {
                                                cb(err);
                                            });
                                        }

                                    });
                                });
                        }
                        else {
                            collectionsToSync.push(
                                //TODO: if websockets are on, then shouldn't need to do fetch at all, can just check for a current connection
                                //TODO: we only need to fetch a collection if it's needed by the next view; the collections required by the next view will be passed by the controller
                                function (cb) {
                                    coll.fetchOptimized(function (err) {
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
                            alert('there was an error syncing collections in the router --->' + err + 'could not change the view.');
                        }
                        else {

                            //if (!window.documentIsReady) {
                            //    //here we don't bother rendering stuff before document is ready?
                            //    return null;
                            //}
                            //else {
                                continueOn.bind(self)(opts);
                            //}

                            //$(function() {
                            //    continueOn.bind(self)(opts);
                            //});
                        }
                    }
                );
            }
        });


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
                if (viewState.get('mainView') != null) {
                    this.destroyView(viewState.get('mainView'));
                }
                if (viewState.get('mainParentView') != null) {
                    this.destroyView(viewState.get('mainParentView'));
                }

                require(['#allViews', '#allTemplates'], function (allViews, allTemplates) {

                    viewState.set('mainView', new allViews['standardViews/IndexView']());
                    window.location.hash = 'index'; //TODO why do we need this line?

                    if (viewState.get('footerView') == null) {
                        viewState.set('footerView', new allViews['standardViews/footerView']());
                    }
                    if (viewState.get('headerView') == null) {
                        viewState.set('headerView', new allViews['standardViews/headerView']());
                    }
                    viewState.get('headerView').render();

                    $('#main-div-id').html(viewState.get('mainView').render().el);

                    viewState.get('footerView').render();
                });


            }
            else { //user is authenticated/authorized

                var view = opts.view;
                if (view == null) {
                    throw new Error('null view in router');
                }

                require(['#allViews', '#allTemplates'], function (allViews, allTemplates) {

                    //TODO: we can do dependency injection by passing allViews and allTemplates to render function of Backbone

                    if (opts.useSidebar === true) {
                        //this.destroyView(viewState.get('mainParentView'));
                        viewState.set('mainParentView', new allViews['standardViews/portalView']());
                        var temp = viewState.get('mainParentView');
                        temp.render();
                    }
                    else {
                        self.destroyView(viewState.get('mainParentView'));
                        viewState.set('mainParentView', null);
                    }

                    if (viewState.get('mainView') != null) {
                        self.destroyView(viewState.get('mainView'));
                        viewState.get('mainView').remove();
                    }
                    viewState.set('mainView', view);

                    var collection = view.collection;
                    var model = view.model;

                    if (appState.get('env') === 'development') {
                        window.currentModel = model;
                        window.currentCollection = collection;
                    }

                    viewState.set('footerView', new allViews['standardViews/footerView']({
                        model: model,
                        collection: collection
                    }));


                    viewState.set('headerView', new allViews['standardViews/headerView']());


                    //**add stylesheets
                    cssAdder.addAllVia(opts.cssAdds || []);

                    //**render header**
                    viewState.get('headerView').render();

                    //**render mainView**
                    if (viewState.get('mainView').givenName !== '@IndexView') {
                        $('#main-content-id').html(viewState.get('mainView').render().el);
                    }
                    else {
                        $('#main-div-id').html(viewState.get('mainView').render().el);
                    }

                    //**render footer**
                    viewState.get('footerView').render();

                });
            }
        }


        return {
            bootRouter: new BootRouter()
        }
    });
