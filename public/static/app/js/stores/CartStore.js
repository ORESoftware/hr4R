/**
 * Created by amills001c on 9/9/15.
 */


/**
 * Created by amills001c on 7/17/15.
 */


/**
 * Created by amills001c on 6/9/15.
 */


console.log('loading app/js/collections/jobsCollection.js');


define(
    [
        'underscore',
        '#allModels',
        '@BaseCollection',
        '@AppDispatcher',
        '#allFluxConstants'

    ],

    function (_, allModels, BaseCollection, AppDispatcher, allFluxConstants) {


        var FluxCartConstants = allFluxConstants['FluxCartConstants'];


        var dispatchCallback = function (payload) {

            var action = payload.action;

            switch (action) {

                case FluxCartConstants.GET_PRODUCTS:
                    fetchModels(null);
                    break;

                case FluxCartConstants.SELECT_PRODUCT:
                    setSelected(action.data);
                    break;

                case FluxCartConstants.CART_ADD:
                    add(action.sku, action.update);
                    break;

                case FluxCartConstants.CART_VISIBLE:
                    setCartVisible(action.cartVisible);
                    break;

                case FluxCartConstants.CART_REMOVE:
                    removeItem(action.sku);
                    break;

                default:
                    return true;
            }

            return true;
        };


        var cartVisible = false;
        var selected = null;


        var CartStore = BaseCollection.extend({


            model: allModels.CartProduct,
            url: '/products',
            batchURL: '/batch/Products',


            initialize: function (models, opts) {

                console.log('model for JobsCollection is:', this.model);

                this.dispatchToken = AppDispatcher.register(dispatchCallback);

                this.givenName = '@CartStore';
                this.uniqueName = '+CartStore';

                this.options = opts || {};
                _.bindAll(this, 'persistCollection');

            },


            getProduct: function (sku) {
                //return this.find(function(model){
                //   return model.get('sku') == sku;
                //});
                return this.models[0];
            },

            getSelected: function () {
                return this.models[0];
            },

            addChangeListener: function (name, callback) {
                this.listenTo(this, name, callback);
            },

            removeChangeListener: function (name, callback) {
                this.stopListening(this, name, callback);
            },

            getCartItems: function () {
                return this.models;
            },

            getCartCount: function () {
                return this.models.length;
            },

            getCartTotal: function () {
                var total = 0;
                this.models.forEach(function (model) {
                    total += model.get('price') * model.get('quantity');
                });
                return total.toFixed(2);
            },

            getCartVisible: function () {
                return cartVisible;
            },

            //TODO:http://www.toptal.com/front-end/simple-data-flow-in-react-applications-using-flux-and-backbone

            // Todos are sorted by their original insertion order.
            comparator: 'order'
        });


        var cartStore = new CartStore();

        cartStore.add(new allModels.CartProduct({
            productName: 'billyProduct', description: 'billP-desc', sku: '12345a', quantity: 2, price: 3.5, variants: [
                {
                    sku: '123123',
                    type: '40oz Bottle',
                    price: 4.99,
                    inventory: 1

                },
                {
                    sku: '123124',
                    type: '6 Pack',
                    price: 12.99,
                    inventory: 5
                },
                {
                    sku: '1231235',
                    type: '30 Pack',
                    price: 19.99,
                    inventory: 3
                }
            ]
        }));

        var products = cartStore.models;

        function fetchModels() {

        }

        function add(sku, update) {
            var models = cartStore.where({sku: sku});
            if (models.length > 1) throw new Error('too many skus');
            models.forEach(function (model) {
                var quantity = model.get('quantity');
                model.set('quantity', quantity + 1);
            });
        }

        function setCartVisible($cartVisible) {
            cartVisible = $cartVisible;
        }

        function removeItem(sku) {
            var items = cartStore.where({sku: sku});
            cartStore.remove(items);
        }


        // Method to set the currently selected product variation
        function setSelected(sku) {
            selected = cartStore.where({sku: sku});
        }


        return cartStore;
    });