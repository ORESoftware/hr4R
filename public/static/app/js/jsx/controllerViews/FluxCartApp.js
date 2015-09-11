/**
 * Created by amills001c on 8/25/15.
 */



define(
    [
        'react',
        '#allCollections',
        '#allModels',
        'app/js/stores/CartStore',
        'app/js/models/all/CartProduct',
        '#allFluxActions',
        'require'

    ],
    function (React, allCollections, allModels, CartStore, ProductStore, allFluxActions, require) {

        var FluxCartActions = allFluxActions['FluxCartActions'];

        //FluxCartActions.getProducts();


        function getCartState() {
            return {
                product: CartStore.getProduct(),
                selected: CartStore.getSelected(),
                cartItems: CartStore.getCartItems(),
                cartCount: CartStore.getCartCount(),
                cartTotal: CartStore.getCartTotal(),
                cartVisible: CartStore.getCartVisible()
            };
        }

        var FluxCartApp = React.createClass({displayName: "FluxCartApp",

            alexSaysReady: false,

            // Get initial state from stores
            getInitialState: function () {
                return getCartState();
            },

            // Add change listeners to stores
            componentDidMount: function () {
                CartStore.addChangeListener('rc-listen', this._onChange);
                FluxCartActions.getProducts();
            },

            componentDidMount_old: function () {
                var self = this;
                CartStore.addChangeListener('rc-listen', self._onChange);
                CartStore.fetchOptimized(function (err) {
                    if (err) {
                        throw err;
                    }
                    else {
                        //if (self.isMounted()) {
                        self.alexSaysReady = true;
                        self.setState(getCartState());
                        CartStore.addChangeListener('rc-listen', self._onChange);
                        //}
                    }
                });
            },

            // Remove change listeners from stores
            componentWillUnmount: function () {
                CartStore.removeChangeListener('rc-listen', this._onChange);
            },

            // Render our child components, passing state via props
            render: function () {

                if (!this.alexSaysReady) {
                    return ( React.createElement("div", {className: "flux-cart-app"}));
                }

                var allViews = require('#allViews');
                var FluxCart = allViews['reactComponents/FluxCart'];
                var FluxProduct = allViews['reactComponents/FluxProduct'];

                return (
                    React.createElement("div", {className: "flux-cart-app"}, 
                        React.createElement(FluxCart, {products: this.state.cartItems, count: this.state.cartCount, 
                                  total: this.state.cartTotal, visible: this.state.cartVisible}), 
                        React.createElement(FluxProduct, {product: this.state.product, cartitems: this.state.cartItems, 
                                     selected: this.state.selected})
                    )
                );
            },

            // Method to setState based upon Store changes
            _onChange: function () {
                this.setState(getCartState());
            }

        });

        //_.extend(FluxCartApp,Backbone.Events);

        return FluxCartApp;
    });