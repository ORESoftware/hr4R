/**
 * Created by amills001c on 8/3/15.
 */


define(
    [
        'underscore',
        '#allCollections'

    ],
    function (_, allCollections) {
        return {
            getAll: function (id, changeViewFunction) {
                require(['app/js/jsx/relViews/getAll/getAll'], function (View) {
                    var view = new View({
                        collection: allCollections.users
                    });
                    //view.render();
                    //var viewOpts = {};
                    //viewOpts.id = id;
                    //var view = new View(viewOpts);
                    var routerOpts = {};
                    routerOpts.view = view;
                    changeViewFunction(routerOpts);
                });
            },

            make: function () {
                require(['views/home/index'], function (view) {
                    view.render();
                });
            },
            about: function () {
                require(['views/home/about'], function (view) {
                    view.render();
                });
            },
            Users: function (id, changeViewFunction) {

                require(['app/js/jsx/Users/UsersView'], function (View) {
                    var viewOpts = {};
                    viewOpts.id = id;
                    var view = new View(viewOpts);
                    var routerOpts = {};
                    routerOpts.view = view;
                    changeViewFunction(routerOpts);
                });
            },
            default: function (id) {
                console.log('id is:!!!', id);
                return 'eureka!';
            }
        };
    });