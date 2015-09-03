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
        '#allCSS',
        '#SuperController'

    ],
    function ($, _, Backbone, allCollections, allCSS, SuperController) {


        function Controller(){

        }

        Controller.prototype = {

            getAll: function (id, changeViewCallback) {

                var viewPath = 'app/js/jsx/relViews/getAll/getAll';
                var viewOpts = {
                    collection: allCollections.jobs
                };
                var routerOpts = {
                    cssAdds: [
                        allCSS['cssx/alert-bangtidy.css'],
                        allCSS['cssx/bootstrap/bootstrap-notify.css']
                    ]
                };
              /*  require([], function (View) {
                    var view = new View({

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
                });*/
                this.control(viewPath,viewOpts,routerOpts,changeViewCallback);
            },
            make: function () {
                require(['app/js/jsx/relViews/getAll'], function (view) {
                    view.render();
                });
            },
            about: function () {
                require(['views/home/about'], function (view) {
                    view.render();
                });
            },
            jobs: function (id, changeViewFunction) {

                require(['app/js/jsx/relViews/jobs/jobsView'], function (View) {

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

        _.extendOwn(Controller.prototype,SuperController.prototype);

        return new Controller();
    });