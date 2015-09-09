/**
 * Created by amills001c on 8/25/15.
 */


define(
    [
        '@AppDispatcher',
        '#allFluxConstants'
    ],
    function(AppDispatcher,allFluxConstants){

        var FluxCartConstants = allFluxConstants['FluxCartConstants'];

        // Define actions object
        var FluxCartActions = {

            //// Receive inital product data
            //receiveProduct: function(data) {
            //    AppDispatcher.handleAction({
            //        actionType: FluxCartConstants.RECEIVE_DATA,
            //        data: data
            //    });
            //},

            getProducts: function() {
                AppDispatcher.handleAction({
                    actionType: FluxCartConstants.GET_PRODUCTS,
                    data: null
                });
            },

            // Set currently selected product variation
            selectProduct: function(index) {
                AppDispatcher.handleAction({
                    actionType: FluxCartConstants.SELECT_PRODUCT,
                    data: index
                });
            },

            // Add item to cart
            addToCart: function(sku, update) {
                AppDispatcher.handleAction({
                    actionType: FluxCartConstants.CART_ADD,
                    sku: sku,
                    update: update
                });
            },

            // Remove item from cart
            removeFromCart: function(sku) {
                AppDispatcher.handleAction({
                    actionType: FluxCartConstants.CART_REMOVE,
                    sku: sku
                });
            },

            // Update cart visibility status
            updateCartVisible: function(cartVisible) {
                AppDispatcher.handleAction({
                    actionType: FluxCartConstants.CART_VISIBLE,
                    cartVisible: cartVisible
                });
            }

        };


      return FluxCartActions;

    });