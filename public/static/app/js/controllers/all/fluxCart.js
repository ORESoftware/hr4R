/**
 * Created by amills001c on 9/8/15.
 */


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


        function Controller() {

        }

        Controller.prototype = {

            getAll: function (id, changeViewCallback) {

                this.control({
                    viewPath: 'app/js/jsx/relViews/getAll/getAll',
                    viewOpts: {
                        collection: allCollections.jobs
                    },
                    routerOpts: {
                        useSidebar: true,
                        cssAdds: [
                            allCSS['cssx/alert-bangtidy.css'],
                            allCSS['cssx/bootstrap/bootstrap-notify.css']
                        ]
                    },
                    callback: changeViewCallback
                });
            },


            default: function (id) {
                return 'eureka!';
            }
        };

        _.extend(Controller.prototype, SuperController);

        return new Controller();
    });