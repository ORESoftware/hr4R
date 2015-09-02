/**
 * Created by denman on 7/25/2015.
 */


define(
    [
        'react'
    ],

    function (React) {

        var Service = React.createClass({displayName: "Service",

            getInitialState: function () {
                return {active: false};
            },

            clickHandler: function () {

                var active = !this.state.active;

                this.setState({active: active});

                // Notify the ServiceChooser, by calling its addTotal method
                this.props.addTotal(active ? this.props.price : -this.props.price);

            },

            render: function () {

                return (
                    React.createElement("p", {className:  this.state.active ? 'active' : '', onClick: this.clickHandler}, 
                    this.props.name, " ", React.createElement("b", null, "$", this.props.price.toFixed(2))
                )
                );

            }

        });

        return Service;

    });