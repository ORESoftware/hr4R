/**
 * Created by amills001c on 8/25/15.
 */


define(
    [
        'underscore',
        '@AppDispatcher',
        '#allFluxConstants',
        'events'
    ],

    function (_, AppDispatcher, allFluxConstants, events) {

        var EventEmitter = events.EventEmitter;

        var FluxCartConstants = allFluxConstants['FluxCartConstants'];


        // Define initial data points
        var products = {};
        var cartVisible = false;

        // Add product to cart
        function add(sku, update) {
            update.quantity = sku in products ? products[sku].quantity + 1 : 1;
            products[sku] = _.extend({}, products[sku], update)
        }

        // Set cart visibility
        function setCartVisible($cartVisible) {
            cartVisible = $cartVisible;
        }

        // Remove item from cart
        function removeItem(sku) {
            delete products[sku];
        }

        // Extend Cart Store with EventEmitter to add eventing capabilities
        var CartStore = _.extend({}, EventEmitter.prototype, {

            // Return cart items
            getCartItems: function () {
                return products;
            },

            // Return # of items in cart
            getCartCount: function () {
                return Object.keys(products).length;
            },

            // Return cart cost total
            getCartTotal: function () {
                var total = 0;
                for (var product in products) {
                    if (products.hasOwnProperty(product)) {
                        total += products[product].price * products[product].quantity;
                    }
                }
                return total.toFixed(2);
            },

            // Return cart visibility state
            getCartVisible: function () {
                return cartVisible;
            },

            // Emit Change event
            emitChange: function () {
                this.emit('change');
            },

            // Add change listener
            addChangeListener: function (callback) {
                this.on('change', callback);
            },

            // Remove change listener
            removeChangeListener: function (callback) {
                this.removeListener('change', callback);
            }

        });

        // Register callback with AppDispatcher
        AppDispatcher.register(function (payload) {
            var action = payload.action;
            var text;

            switch (action.actionType) {

                // Respond to CART_ADD action
                case FluxCartConstants.CART_ADD:
                    add(action.sku, action.update);
                    break;

                // Respond to CART_VISIBLE action
                case FluxCartConstants.CART_VISIBLE:
                    setCartVisible(action.cartVisible);
                    break;

                // Respond to CART_REMOVE action
                case FluxCartConstants.CART_REMOVE:
                    removeItem(action.sku);
                    break;

                default:
                    return true;
            }

            // If action was responded to, emit change event
            CartStore.emitChange();

            return true;

        });

        return CartStore;

    });