/**
 * Created by denman on 7/25/2015.
 */


define(
    [
        'react'
    ],

    function (React) {

        var Picture = React.createClass({displayName: "Picture",

            // This component doesn't hold any state - it simply transforms
            // whatever was passed as attributes into HTML that represents a picture.

            clickHandler: function () {

                // When the component is clicked, trigger the onClick handler that
                // was passed as an attribute when it was constructed:

                this.props.onClick(this.props.ref);
            },

            render: function () {

                var cls = 'picture ' + (this.props.favorite ? 'favorite' : '');

                return (

                    React.createElement("div", {className: cls, onClick: this.clickHandler}, 
                        React.createElement("img", {src: this.props.src, width: "200", title: this.props.title})
                    )

                );

            }

        });

        return Picture;

    });