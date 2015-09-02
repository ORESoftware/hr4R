/**
 * Created by amills001c on 8/5/15.
 */



define(
    [
        'react'
    ],

    function (React) {


        var Item = React.createClass({displayName: "Item",
            mixins: [React.Backbone],
            updateOnProps: { 'item': 'model' },

            render: function() {
                return React.createElement("span", null,  this.props.item.get('name') )
                { this.props.item.get('description') }
            }
            });

    });