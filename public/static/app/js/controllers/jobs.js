/**
 * Created by amills001c on 7/31/15.
 */


    // Filename: controllers/home.js
define(
    [
        'jquery',
        'underscore',
        'backbone',
        '#allCollections',
        '#allCSS'

    ],
    function ($, _, Backbone, allCollections, allCSS) {
        return {
            getAll: function (id, changeViewCallback) {
                require(['jsx!app/js/views/relViews/getAll/getAll'], function (View) {
                    var view = new View({
                        collection: allCollections.jobs
                    });
                    //view.render();
                    //var viewOpts = {};
                    //viewOpts.id = id;
                    //var view = new View(viewOpts);
                    var routerOpts = {};
                    routerOpts.view = view;
                    routerOpts.cssAdds = [
                        allCSS['cssx/alert-bangtidy.css'],
                        allCSS['cssx/bootstrap/bootstrap-notify.css']
                    ];

                    changeViewCallback(routerOpts);
                });
            },
            make: function () {
                require(['jsx!app/js/views/relViews/getAll'], function (view) {
                    view.render();
                });
            },
            about: function () {
                require(['views/home/about'], function (view) {
                    view.render();
                });
            },
            jobs: function (id, changeViewFunction) {

                require(['jsx!app/js/views/relViews/jobs/jobsView'], function (View) {

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