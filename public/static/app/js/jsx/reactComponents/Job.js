/**
 * Created by denmanm1 on 7/31/15.
 */


define(
    [
        'react'
    ],

    function (React) {

        var Job = React.createClass({displayName: "Job",

            // This component doesn't hold any state - it simply transforms
            // whatever was passed as attributes into HTML that represents a picture.

            clickHandler: function () {

                // When the component is clicked, trigger the onClick handler that
                // was passed as an attribute when it was constructed:

                this.props.onClick(this.props.ref);
            },

            render: function () {

                var cls = 'job ' + (this.props.favorite ? 'favorite' : '');

                return (

                    React.createElement("div", {className: cls, onClick: this.clickHandler}, 
                        React.createElement("span", {height: "200", width: "200", title: this.props.title}), 
                        React.createElement("select", {value: "isFavorited"}, 
                            React.createElement("option", {value: "true"}, "Favorite this job with id=", this.props.id), 
                            React.createElement("option", {value: "false"}, "Unfavorite")
                        )
                    )

                );

            }

        });

        return Job;

    });