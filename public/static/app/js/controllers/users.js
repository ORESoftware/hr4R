/**
 * Created by amills001c on 8/3/15.
 */


define(
    [
        'jquery',
        'underscore',
        'backbone',
        //////////

    ],
    function ($, _, Backbone) {
        return {
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

                require(['jsx!app/js/views/Users/UsersView'], function (View) {

                    var viewOpts = {};
                    viewOpts.id = id;
                    var view = new View(viewOpts);
                    var routerOpts = {};
                    routerOpts.view = view;
                    changeViewFunction(routerOpts);
                });
            },
            default: function (id) {
                console.log('id is:!!!',id);
                return 'eureka!';
            }
        };
    });