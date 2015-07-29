/**
 * Created by denman on 7/25/2015.
 */


define(
    [
        'react',
        'jsx!app/js/views/reactViews/Service'
    ],

    function (React, Service) {
        /** @jsx React.DOM */


        var ServiceChooser = React.createClass({

            getInitialState: function () {
                return {total: 0};
            },

            addTotal: function (price) {
                this.setState({total: this.state.total + price});
            },

            render: function () {

                var self = this;

                var services = this.props.items.map(function (s) {

                    // Create a new Service component for each item in the items array.
                    // Notice that I pass the self.addTotal function to the component.

                    return <Service name={s.name} price={s.price} active={s.active} addTotal={self.addTotal}/>;
                });

                return <div>
                    <h1>Our services</h1>

                    <div id="services">
                        {services}

                        <p id="total">Total <b>${this.state.total.toFixed(2)}</b></p>

                    </div>

                </div>;

            }
        });

        return ServiceChooser;
    });