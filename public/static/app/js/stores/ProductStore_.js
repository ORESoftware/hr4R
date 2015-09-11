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
        var _product = {};
        var _selected = null;

        // Method to load product data from mock API
        function loadProductData(data) {
            _product = data[0];
            _selected = data[0].variants[0];
        }

        // Method to set the currently selected product variation
        function setSelected(index) {
            _selected = _product.variants[index];
        }


        // Extend ProductStore with EventEmitter to add eventing capabilities
        var ProductStore = _.extend({}, EventEmitter.prototype, {

            // Return Product data
            getProduct: function () {
                return _product;
            },

            // Return selected Product
            getSelected: function () {
                return _selected;
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

                // Respond to RECEIVE_DATA action
                case FluxCartConstants.RECEIVE_DATA:
                    loadProductData(action.data);
                    break;

                // Respond to SELECT_PRODUCT action
                case FluxCartConstants.SELECT_PRODUCT:
                    setSelected(action.data);
                    break;

                default:
                    return true;
            }

            // If action was responded to, emit change event
            ProductStore.emitChange();

            return true;

        });

        return ProductStore;
    });