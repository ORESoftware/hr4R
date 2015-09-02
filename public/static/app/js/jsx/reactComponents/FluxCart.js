/**
 * Created by amills001c on 8/25/15.
 */


define(
    [
        'react',
        '#allFluxActions'
    ],
    function (React, allFluxActions) {

        var FluxCartActions = allFluxActions['actions/FluxCartActions'];

        var FluxCart = React.createClass({displayName: "FluxCart",

            // Hide cart via Actions
            closeCart: function () {
                FluxCartActions.updateCartVisible(false);
            },

            // Show cart via Actions
            openCart: function () {
                FluxCartActions.updateCartVisible(true);
            },

            // Remove item from Cart via Actions
            removeFromCart: function (sku) {
                FluxCartActions.removeFromCart(sku);
                FluxCartActions.updateCartVisible(false);
            },

            render: function () {
                var self = this, products = this.props.products;
                return (
                    React.createElement("div", {className: "flux-cart " + (this.props.visible ? 'active' : '')}, 
                        React.createElement("div", {className: "mini-cart"}, 
                            React.createElement("button", {type: "button", className: "close-cart", onClick: this.closeCart}, "×"), 
                            React.createElement("ul", null, 
                                Object.keys(products).map(function (product) {
                                    return (
                                        React.createElement("li", {key: product}, 
                                            React.createElement("h1", {className: "name"}, products[product].name), 

                                            React.createElement("p", {className: "type"}, products[product].type, 
                                                "x ", products[product].quantity), 

                                            React.createElement("p", {className: "price"}, 
                                                "$", (products[product].price * products[product].quantity).toFixed(2)), 
                                            React.createElement("button", {type: "button", className: "remove-item", 
                                                    onClick: self.removeFromCart.bind(self, product)}, "Remove"
                                            )
                                        )
                                    )
                                })
                            ), 
                            React.createElement("span", {className: "total"}, "Total: $", this.props.total)
                        ), 
                        React.createElement("button", {type: "button", className: "view-cart", onClick: this.openCart, 
                                disabled: Object.keys(this.props.products).length > 0 ? "" : "disabled"}, "View Cart" + ' ' +
                            "(", this.props.count, ")"
                        )
                    )
                );
            }

        });

        return FluxCart;
    });