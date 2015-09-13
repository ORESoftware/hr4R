/**
 * Created by amills001c on 7/31/15.
 */


    // Filename: controllers/home.js
define(
    [
        'underscore',
        '#allCollections',
        '#allCSS',
        '@SuperController'

    ],
    function (_, allCollections, allCSS, SuperController) {


        function Controller(a,b) {
            this.a = a;
            var c = SuperController.constructor;
            c.call(this,b);
        }


        Controller.prototype = Object.assign(Object.create(SuperController.__proto__),{

            getAll: function (id, changeViewCallback) {
                var viewPath = 'app/js/jsx/relViews/getAll/getAll';
                var viewOpts = {
                    collection: allCollections.jobs
                };
                var routerOpts = {
                    useSidebar: true,
                    cssAdds: [
                        allCSS['cssx/alert-bangtidy.css'],
                        allCSS['cssx/bootstrap/bootstrap-notify.css']
                    ]
                };
                this.control(viewPath, viewOpts, routerOpts, changeViewCallback);
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

            jobs: function (id, changeViewCallback) {

                var viewPath = 'app/js/jsx/relViews/jobs/jobsView';
                var viewOpts = {};
                viewOpts.id = id;
                var routerOpts = {
                    useSidebar: true
                };
                this.control(viewPath, viewOpts, routerOpts, changeViewCallback);
            },


            default: function (id) {
                console.log('id is:!!!', id);
                return 'eureka!';
            }
        });

        //_.defaults(Controller.prototype, SuperController);

        //var sup = Object.create(SuperController.prototype);
        //_.extend(Object.create(SuperController.prototype),Controller.prototype);


        var controller = new Controller();

        return controller;
    });