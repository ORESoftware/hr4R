/**
 * Created by amills001c on 7/31/15.
 */


define(
    [
        'react'
    ],

    function (React) {

        var Job = React.createClass({

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

                    <div className={cls} onClick={this.clickHandler}>
                        <span height="200" width="200" title={this.props.title}/>
                        <select value="isFavorited">
                            <option value="true">Favorite this job with id={this.props.id}</option>
                            <option value="false">Unfavorite</option>
                        </select>
                    </div>

                );

            }

        });

        return Job;

    });