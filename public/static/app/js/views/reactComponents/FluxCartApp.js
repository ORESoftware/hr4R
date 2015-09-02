/**
 * Created by amills001c on 8/25/15.
 */



define(
    [
        'react',
        //'#allReactComponents',
        "app/js/jsx/reactComponents/FluxCart",
        "app/js/jsx/reactComponents/FluxProduct",
        //'app/js/ReactComponentMediator',
        '#allCollections',
        '#allModels',
        'app/js/stores/CartStore',
        'app/js/stores/ProductStore',
        'require'

    ],
    function (React,FluxCart, FluxProduct, allCollections, allModels, CartStore, ProductStore) {

        //alert('peas');

        //var FluxCart = RCM.findReactComponentByName('reactComponents/FluxCart');
        //var FluxProduct = RCM.findReactComponentByName('reactComponents/FluxProduct');

        //var FluxCart = RCM.allReactComponents['reactComponents/FluxCart'];
        //var FluxProduct = RCM.allReactComponents['reactComponents/FluxProduct'];

        //alert(FluxCart);
        //alert(FluxProduct);

        // Method to retrieve state from Stores
        function getCartState() {
            return {
                product: ProductStore.getProduct(),
                selectedProduct: ProductStore.getSelected(),
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
                ProductStore.addChangeListener(this._onChange);
                CartStore.addChangeListener(this._onChange);
            },

            // Remove change listeners from stores
            componentWillUnmount: function () {
                ProductStore.removeChangeListener(this._onChange);
                CartStore.removeChangeListener(this._onChange);
            },

            // Render our child components, passing state via props
            render: function () {
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

        return FluxCartApp;

    });