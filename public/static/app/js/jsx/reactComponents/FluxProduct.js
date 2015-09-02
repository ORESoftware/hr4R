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

        // Flux product view
        var FluxProduct = React.createClass({displayName: "FluxProduct",

            // Add item to cart via Actions
            addToCart: function (event) {
                var sku = this.props.selected.sku;
                var update = {
                    name: this.props.product.name,
                    //type: this.props.selected.type,
                    type: 'foo',
                    price: this.props.selected.price
                };
                FluxCartActions.addToCart(sku, update);
                FluxCartActions.updateCartVisible(true);
            },

            // Select product variation via Actions
            selectVariant: function (event) {
                FluxCartActions.selectProduct(event.target.value);
            },

            // Render product View
            render: function () {
                var ats = (this.props.selected.sku in this.props.cartitems) ?
                this.props.selected.inventory - this.props.cartitems[this.props.selected.sku].quantity :
                    this.props.selected.inventory;
                return (
                    React.createElement("div", {className: "flux-product"}, 
                        React.createElement("img", {src: 'img/' + this.props.product.image}), 

                        React.createElement("div", {className: "flux-product-detail"}, 
                            React.createElement("h1", {className: "name"}, this.props.product.name), 

                            React.createElement("p", {className: "description"}, this.props.product.description), 

                            React.createElement("p", {className: "price"}, "Price: $", this.props.selected.price), 
                            React.createElement("select", {onChange: this.selectVariant}, 
                                this.props.product.variants.map(function (variant, index) {
                                    return (
                                        React.createElement("option", {key: index, value: index}, variant.type)
                                    )
                                })
                            ), 
                            React.createElement("button", {type: "button", onClick: this.addToCart, disabled: ats  > 0 ? '' : 'disabled'}, 
                                ats > 0 ? 'Add To Cart' : 'Sold Out'
                            )
                        )
                    )
                );
            }

        });

        return FluxProduct;
    });