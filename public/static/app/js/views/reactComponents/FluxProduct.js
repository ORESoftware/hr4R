/**
 * Created by denmanm1 on 8/25/15.
 */


define(
    [
        'react',
        '#allFluxActions'
    ],
    function (React, allFluxActions) {

        var FluxCartActions = allFluxActions['FluxCartActions'];

        var FluxProduct = React.createClass({

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
                    <div className="flux-product">
                        <div className="flux-product-detail">
                            <h1 className="name">{this.props.product.get('name')}</h1>

                            <p className="description">{this.props.product.get('description')}</p>

                            <p className="price">Price: ${this.props.selected.get('price')}</p>
                            <select onChange={this.selectVariant}>
                                {this.props.product.get('variants').map(function (variant, index) {
                                    return (
                                        <option key={index} value={index}>{variant.type}</option>
                                    )
                                })}
                            </select>
                            <button type="button" onClick={this.addToCart} disabled={ats  > 0 ? '' : 'disabled'}>
                                {ats > 0 ? 'Add To Cart' : 'Sold Out'}
                            </button>
                        </div>
                    </div>
                );
            }
        });


        return FluxProduct;
    });