/**
 * Created by denman on 7/25/2015.
 */


define(
    [
        'react',
        'require'
        //'app/js/jsx/reactComponents/Service'
    ],

    function (React,require) {
        /** @jsx React.DOM */


        var ServiceChooser = React.createClass({

            getInitialState: function () {
                return {total: 0};
            },

            addTotal: function (price) {
                this.setState({total: this.state.total + price});
            },

            renderAsync: function () {

                var self = this;

                require(['app/js/jsx/reactComponents/Service'], function (Service) {

                    self.render(Service);

                });
            },

            render: function () {

                var self = this;

                var Service = require('app/js/jsx/reactComponents/Service');

                var services = this.props.items.map(function (s) {

                    // Create a new Service component for each item in the items array.
                    // Notice that I pass the self.addTotal function to the component.

                    return <Service name={s.name} price={s.price} active={s.active} addTotal={self.addTotal}/>;
                });

                //return ();

                return (<div>
                    <h1>Our services</h1>

                    <div id="services">
                        {services}

                        <p id="total">Total <b>${this.state.total.toFixed(2)}</b></p>

                    </div>

                </div>);

            }
        });

        return ServiceChooser;
    });