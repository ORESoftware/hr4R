/**
 * Created by denman on 7/25/2015.
 */


define(
    [
        'react'
    ],

    function (React) {


        var SearchExample = React.createClass({

            getInitialState: function () {
                return {searchString: ''};
            },

            handleChange: function (e) {

                // If you comment out this line, the text box will not change its value.
                // This is because in React, an input cannot change independently of the value
                // that was assigned to it. In our case this is this.state.searchString.

                this.setState({searchString: e.target.value});
            },

            render: function () {

                var libraries = this.props.items;
                var searchString = this.state.searchString.trim().toLowerCase();


                if (searchString.length > 0) {

                    // We are searching. Filter the results.

                    libraries = libraries.filter(function (l) {
                        return l.name.toLowerCase().match(searchString);
                    });

                }

                return <div>
                    <input type="text" value={this.state.searchString} onChange={this.handleChange}
                           placeholder="Type here"/>

                    <ul>

                        { libraries.map(function (l) {
                            return <li>{l.name} <a href={l.url}>{l.url}</a></li>
                        }) }

                    </ul>

                </div>;
            }
        });


        return SearchExample;

    });