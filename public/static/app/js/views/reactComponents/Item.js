/**
 * Created by denmanm1 on 8/5/15.
 */



define(
    [
        'react'
    ],

    function (React) {


        var Item = React.createClass({
            mixins: [React.Backbone],
            updateOnProps: {'item': 'model'},

            render: function () {
                return (<span>{ this.props.item.get('name') }</span>)
            }
        });

    });