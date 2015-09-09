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

        // Flux product view
        var FluxProduct = React.createClass({

            // Add item to cart via Actions
            addToCart: function (event) {
                var sku = this.props.selected.sku;
                var update = {
                    name: this.props.product.name,
                    type: this.props.selected.type,
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
                    <div className="flux-product">


                    </div>
                );
            }
        });

        /*  <div className="flux-product-detail">
         <h1 className="name">{this.props.product.name}</h1>

         <p className="description">{this.props.product.description}</p>

         <p className="price">Price: ${this.props.selected.price}</p>
         <select onChange={this.selectVariant}>
         {this.props.product.variants.map(function (variant, index) {
         return (
         <option key={index} value={index}>{variant.type}</option>
         )
         })}
         </select>
         <button type="button" onClick={this.addToCart} disabled={ats  > 0 ? '' : 'disabled'}>
         {ats > 0 ? 'Add To Cart' : 'Sold Out'}
         </button>
         </div>*/

        return FluxProduct;
    });