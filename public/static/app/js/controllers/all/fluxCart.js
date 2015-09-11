/**
 * Created by amills001c on 9/8/15.
 */


define(
    [
        'underscore',
        '#allCollections',
        '#allCSS',
        '@SuperController'

    ],
    function (_, allCollections, allCSS, SuperController) {


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
                            allCSS['cssx/bootstrap/bootstrap-notify.css'],
                            allCSS['cssx/fluxCart/fluxCart.css']
                        ]
                    }
                }, changeViewCallback)
            },

            show: function (id, changeViewCallback) {

                this.control({
                    viewPath: 'app/js/jsx/relViews/FluxCart/FluxCartMain',
                    viewOpts: {
                        collection: null,
                        model: null
                    },
                    routerOpts: {
                        useSidebar: true,
                        cssAdds: [
                            allCSS['cssx/alert-bangtidy.css'],
                            allCSS['cssx/bootstrap/bootstrap-notify.css'],
                            allCSS['cssx/fluxCart/fluxCart.css']
                        ]
                    }
                }, changeViewCallback)
            },


            default: function (id) {
                return 'eureka!';
            }
        };

        _.defaults(Controller.prototype, SuperController.prototype);
        //_.extend(Object.create(SuperController.prototype),Controller.prototype);

        return new Controller();
    });