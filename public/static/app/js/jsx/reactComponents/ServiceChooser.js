/**
 * Created by denman on 7/25/2015.
 */


define(
    [
        'react',
        'jsx!app/js/views/reactComponents/Service'
    ],

    function (React, Service) {
        /** @jsx React.DOM */


        var ServiceChooser = React.createClass({displayName: "ServiceChooser",

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

                    return React.createElement(Service, {name: s.name, price: s.price, active: s.active, addTotal: self.addTotal});
                });

                return (React.createElement("div", null, 
                    React.createElement("h1", null, "Our services"), 

                    React.createElement("div", {id: "services"}, 
                        services, 

                        React.createElement("p", {id: "total"}, "Total ", React.createElement("b", null, "$", this.state.total.toFixed(2)))

                    )

                ));

            }
        });

        return ServiceChooser;
    });