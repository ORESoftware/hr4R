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


        function Controller(a,b) {
            this.a = a;
            SuperController.constructor.call(this,b);
        }

        //Controller.prototype = Object.assign(Object.create(SuperController.__proto__),{  //Opera browser doesn't support Object.assign yet
        Controller.prototype = _.extend(Object.create(SuperController.__proto__),{

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
        });

        //_.defaults(Controller.prototype, SuperController);
        //_.defaults(Controller.prototype, SuperController.__proto__);
        //_.extend(Object.create(SuperController.prototype),Controller.prototype);

        var controller = new Controller();

        return controller;
    });