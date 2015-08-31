/**
 * Created by amills001c on 7/21/15.
 */

//TODO: http://stackoverflow.com/questions/21854938/using-mixins-vs-components-for-code-reuse-in-facebook-react
//TODO: https://medium.com/@dan_abramov/mixins-are-dead-long-live-higher-order-components-94a0d2f9e750

define(
    [
        'backbone',
        'react'
    ],

    function (Backbone, React) {

        React.Backbone = {
            listenToProps: function (props) {
                _.each(this.updateOnProps, function (events, propName) {
                    switch (events) {
                        case 'collection':
                            events = 'add remove reset sort';
                            break;
                        case 'model':
                            events = 'change';
                    }
                    this.listenTo(props[propName], events, function () {
                        this.forceUpdate();
                    })
                }, this)
            },

            componentDidMount: function () {
                this.listenToProps(this.props);
            },

            componentWillReceiveProps: function (nextProps) {
                this.stopListening();
                this.listenToProps(nextProps);
            },

            componentWillUnmount: function () {
                this.stopListening();
            }
        };

        _.extend(React.Backbone, Backbone.Events);


        return React.Backbone;
    });