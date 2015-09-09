/**
 * Created by amills001c on 8/25/15.
 */



define(
    [
        'react',
        //'#allReactComponents',
        //"app/js/jsx/reactComponents/FluxCart",
        //"app/js/jsx/reactComponents/FluxProduct",
        //'app/js/ReactComponentMediator',
        '#allCollections',
        '#allModels',
        'app/js/stores/CartStore',
        'app/js/models/all/CartProduct',
        '#allFluxActions',
        'require'

    ],
    function (React, allCollections, allModels, CartStore, ProductStore, allFluxActions, require) {


        //var FluxCart = RCM.findReactComponentByName('reactComponents/FluxCart');
        //var FluxProduct = RCM.findReactComponentByName('reactComponents/FluxProduct');

        var FluxCartActions = allFluxActions['FluxCartActions'];

        FluxCartActions.getProducts();

        var CartAPI_ = {

            getProductData: function () {
                var data = JSON.parse(localStorage.getItem('product'));
                FluxCartActions.receiveProduct(data);
            }

        };

        var ProductData_ = {
            // Load Mock Product Data Into localStorage
            init: function () {
                //localStorage.clear();
                localStorage.setItem('product', JSON.stringify([
                    {
                        id: '0011001',
                        name: 'Scotch.io Signature Lager',
                        description: 'The finest lager money can buy.',
                        variants: [
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
                    }
                ]));
            }
        };


        //ProductData.init();
        //
        //CartAPI.getProductData();

        function getCartState() {
            return {
                product: CartStore.getProduct(),
                selectedProduct: CartStore.getSelected(),
                cartItems: CartStore.getCartItems(),
                cartCount: CartStore.getCartCount(),
                cartTotal: CartStore.getCartTotal(),
                cartVisible: CartStore.getCartVisible()
            };
        }

        // Define main Controller View
        var FluxCartApp = React.createClass({

            // Get initial state from stores
            getInitialState: function () {
                return getCartState();
            },

            // Add change listeners to stores
            componentDidMount: function () {
                CartStore.fetch()
                    .done(function () {
                        if (this.isMounted()) {
                            this.setState(getCartState());
                        }
                    })
                    .fail(function (err) {
                        throw err;
                    }).always(function(){
                        CartStore.addChangeListener('rc-listen',this._onChange);
                    });
            },

            // Remove change listeners from stores
            componentWillUnmount: function () {
                CartStore.removeChangeListener('rc-listen',this._onChange);
            },

            // Render our child components, passing state via props
            render: function () {

                var allViews = require('#allViews');
                var FluxCart = allViews['reactComponents/FluxCart'];
                var FluxProduct = allViews['reactComponents/FluxProduct'];

                return (
                    <div className="flux-cart-app">
                        <FluxCart products={this.state.cartItems} count={this.state.cartCount}
                                  total={this.state.cartTotal} visible={this.state.cartVisible}/>
                        <FluxProduct product={this.state.product} cartitems={this.state.cartItems}
                                     selected={this.state.selectedProduct}/>
                    </div>
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