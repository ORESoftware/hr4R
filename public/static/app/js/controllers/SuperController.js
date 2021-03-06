/**
 * Created by denmanm1 on 9/3/15.
 */


define([
        'underscore',
        '#allCollections'
    ],
    function (_, allCollections) {


        function SuperController(b) {
             this.b = b;
        }

        SuperController.prototype = new Object({

            control: function (viewPath, viewOpts, routerOpts, cb) {

                if (typeof viewPath === 'object') {
                    var options = viewPath;
                    cb = viewOpts;
                    viewPath = options.viewPath;
                    viewOpts = options.viewOpts;
                    routerOpts = options.routerOpts;
                }

                require([viewPath], function (View) {
                    routerOpts.view = new View(viewOpts);
                    cb(routerOpts);
                });
            },

            default: function (id) {
                alert('controller has not yet implemented a default')
            }
        });

        var superController = new SuperController();
        superController.constructor = SuperController;
        return superController;
    });