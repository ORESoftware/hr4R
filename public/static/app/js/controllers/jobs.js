/**
 * Created by amills001c on 7/31/15.
 */


    // Filename: controllers/home.js
define(
    [
        'jquery',
        'underscore',
        'backbone'

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
            jobs: function (id, changeViewFunction) {

                require(['jsx!app/js/views/jobs/jobsView'], function (View) {

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