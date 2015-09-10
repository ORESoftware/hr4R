/**
 * Created by amills001c on 8/25/15.
 */


define(
    [
        'react',
        '#allFluxActions'
    ],
    function (React, allFluxActions) {

        var FluxCartActions = allFluxActions['FluxCartActions'];

        var FluxProduct = React.createClass({displayName: "FluxProduct",

            addToCart: function (event) {
                var sku = this.props.selected.get('sku');
                var update = {
                    name: this.props.product.get('productName'),
                    type: this.props.selected.get('type'),
                    price: this.props.selected.get('price')
                };
                FluxCartActions.addToCart(sku, update);
                FluxCartActions.updateCartVisible(true);
            },

            // Select product variation via Actions
            selectVariant: function (event) {
                FluxCartActions.selectProduct(event.target.value);
            },

            render: function () {


                var ats = (this.props.selected.get('sku') in this.props.cartitems) ?
                this.props.selected.get('inventory') - this.props.cartitems[this.props.selected.get('sku')].quantity : this.props.selected.get('inventory');


                return (
                    React.createElement("div", {className: "flux-product"}, 
                        React.createElement("div", {className: "flux-product-detail"}, 
                            React.createElement("h1", {className: "name"}, this.props.product.get('name')), 

                            React.createElement("p", {className: "description"}, this.props.product.get('description')), 

                            React.createElement("p", {className: "price"}, "Price: $", this.props.selected.get('price')), 
                            React.createElement("select", {onChange: this.selectVariant}, 
                                this.props.product.get('variants').map(function (variant, index) {
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