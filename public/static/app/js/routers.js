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
        'react',
        'backbone',
        'async',
        'app/js/allCollections',
        'ijson',
        'app/js/allViews',
        'jsx!app/js/views/todoList'
    ],

    function (appState, viewState, React, Backbone, async, collections, IJSON, allViews, TodoList) {


        var BootRouter = Backbone.Router.extend({

            viewState: viewState,

            routes: {
                '': 'canonical',
                "+refreshCurrentPage": "refreshCurrentPage",
                "posts/:id": "getPost",
                'books/:id': 'bookScreen',
                'index': 'index',
                'home': 'home',
                'userProfile': 'userProfile',
                'portal': 'portal',
                'login': 'login',
                ":route/:action": "loadView",
                "*notFound": "defaultRoute" // Backbone will try to match the routes above first
            },

            canonical: function () {
                // this is a no operation function
                console.log('hit the canonical route.');
            },

            refreshCurrentPage: function () {

                //TODO:refresh current page when user calls reset-all or whatever

                var currentView = this.viewState.get('mainView');
                var currentViewName = currentView.givenName;
                currentViewName = currentViewName.replace('View', '').replace('@', '');
                //TODO: need to fix url of this page
                this.changeView(new allViews[currentViewName]());
            },

            home: function () {

                this.changeView({
                    //view:allViews.Home,
                    //view: new allViews.Home({el: '#main-content-id'}),
                    view: new allViews.Home(),
                    useSidebar: true
                });
            },
            portal: function () {

                this.changeView({
                    //view: allViews.Portal,
                    view: new allViews.Portal(),
                    useSidebar: true
                });
            },

            userProfile: function () {
                this.changeView({
                    //view: allViews.UserProfile,
                    view: new allViews.UserProfile(
                        {
                            //el:'#main-content-id',
                            model: appState.get('currentUser'),
                            collection: collections.users
                        }
                    ),
                    useSidebar: true
                });
            },


            index: function () {
                this.changeView({
                    //view:allViews.Index,
                    view: new allViews.Index({collection: collections.users}),
                    useSidebar: false
                });
            },

            bookScreen: function(id) {
                // Fetch book with `id` and render it.
            },

            defaultRoute: function () {

                var todos = new Backbone.Collection([
                    {
                        text: 'Dishes!',
                        dueDate: new Date().toISOString()
                    }
                ]);

                React.render(<TodoList todos={todos}/>, document.body);

                return null;


                /* //this.changeView(new allViews.Home());
                 this.navigate('home', {trigger: true});
                 //TODO: fix this so that if user puts in unknown route into address bar, that it goes to home*/
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

                Object.keys(collections).forEach(function (key) {
                    if (collections.hasOwnProperty(key)) {
                        collectionsToSync.push(
                            function (cb) {
                                //TODO: this will be incorrect with more than one collection because key will be wrong
                                var coll = collections[key];
                                coll.persistCollection({}, function (err, res) {
                                    if (err) {
                                        return cb(err);
                                    }
                                    coll.fetch().done(function () {
                                        cb();
                                    });
                                });
                            });
                    }
                });

                async.parallel(collectionsToSync,
                    function final(err, results) {
                        if (err) {
                            onError(err);
                        }
                        else {
                            //continueOn(self);//continueOn().bind(self);//var func = continueOn.bind(self);//func();
                            continueOn.bind(self)(opts); //bind continueOn function self and then call continueOn()
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


            //TODO: ejs.update()
            //TODO: http://danhough.com/blog/backbone-view-inheritance/


            //if (appGlobal.currentUser == null || appGlobal.authorized === false) {

            //if (appState.get('authorized') !== true) {

            if (!appState.currentUserSessionIsOK()) {
                if (this.viewState.get('mainView') != null) {
                    this.destroyView(this.viewState.get('mainView'));
                }
                if (this.viewState.get('mainParentView') != null) {
                    this.destroyView(this.viewState.get('mainParentView'));
                }
                this.viewState.set('mainView', new allViews.Index());
                window.location.hash = 'index'; //TODO why do we need this line?

                if (this.viewState.get('footerView') == null) {
                    this.viewState.set('footerView', new allViews.Footer());
                }
                if (this.viewState.get('headerView') == null) {
                    this.viewState.set('headerView', new allViews.Header());
                }
                this.viewState.get('headerView').render();
                //this.viewState.get('mainView').render();
                $('#main-div-id').html(this.viewState.get('mainView').render().el);
                this.viewState.get('footerView').render();


            }
            else { //user is authenticated/authorized

                var view = opts.view;
                if (view == null) {
                    throw new Error('null view in router');
                }


                if (opts.useSidebar === true) {
                    //this.destroyView(this.viewState.get('mainParentView'));
                    this.viewState.set('mainParentView', new allViews.Portal());
                    var temp = this.viewState.get('mainParentView');
                    temp.render();
                }
                else {
                    this.destroyView(this.viewState.get('mainParentView'));
                    this.viewState.set('mainParentView', null);
                }

                //var view = opts.view;
                //if (view == null) {
                //    throw new Error('null view in router');
                //}
                //else{
                //    view = new view();
                //}


                if (this.viewState.get('mainView') != null) {
                    //this.destroyView(this.viewState.get('mainView'));
                    this.viewState.get('mainView').remove();
                }
                this.viewState.set('mainView', view);
                console.log('current main view:', view.givenName);

                if (this.viewState.get('footerView') == null) {
                    this.viewState.set('footerView', new allViews.Footer());
                }
                if (this.viewState.get('headerView') == null) {
                    this.viewState.set('headerView', new allViews.Header());
                }
                this.viewState.get('headerView').render();
                //this.viewState.get('mainView').render();
                if(this.viewState.get('mainView').givenName !== '@IndexView'){
                    $('#main-content-id').html(this.viewState.get('mainView').render().el);
                }
                else{
                    //this.viewState.get('mainView').render();
                    $('#main-div-id').html(this.viewState.get('mainView').render().el);
                }

                this.viewState.get('footerView').render();

            }
        }


        return {
            bootRouter: bootRouter
        }
    });
