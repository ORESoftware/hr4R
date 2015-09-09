/**
 * Created by amills001c on 9/3/15.
 */


define([
        'jquery',
        'underscore',
        'backbone',
        '#allCollections'
    ],
    function ($, _, Backbone, allCollections) {


        function SuperController() {

        }

        SuperController.prototype = {

            control: function (viewPath, viewOpts, routerOpts, cb) {

                if(typeof viewPath === 'object'){
                    var options = viewPath;
                    var viewPath = options.viewPath;
                    viewOpts = options.viewOpts;
                    routerOpts = options.routerOpts;
                    cb = options.callback;
                }

                require([viewPath], function (View) {
                    var view = new View(viewOpts);
                    routerOpts.view = view;
                    cb(routerOpts);
                });
            },

            default: function (id) {
                alert('controller has not yet implemented a default')
            }
        };


        return new SuperController();

        //return SuperController;

    });