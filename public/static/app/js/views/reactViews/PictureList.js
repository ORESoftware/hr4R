/**
 * Created by denman on 7/25/2015.
 */




define(
    [
        'react',
        'jsx!app/js/views/reactViews/Picture'
    ],

    function (React, Picture) {

        var PictureList = React.createClass({

            getInitialState: function () {

                // The pictures array will be populated via AJAX, and
                // the favorites one when the user clicks on an image:

                return {pictures: [], favorites: []};
            },

            componentDidMount: function () {

                // When the component loads, send a jQuery AJAX request

                var self = this;

                // API endpoint for Instagram's popular images for the day

                var url = 'https://api.instagram.com/v1/media/popular?client_id=' + this.props.apiKey + '&callback=?';

                $.getJSON(url, function (result) {

                    if (!result || !result.data || !result.data.length) {
                        return;
                    }

                    var pictures = result.data.map(function (p) {

                        return {
                            id: p.id,
                            url: p.link,
                            src: p.images.low_resolution.url,
                            title: p.caption ? p.caption.text : '',
                            favorite: false
                        };

                    });

                    // Update the component's state. This will trigger a render.
                    // Note that this only updates the pictures property, and does
                    // not remove the favorites array.

                    self.setState({pictures: pictures});

                });

            },

            pictureClick: function (id) {

                // id holds the ID of the picture that was clicked.
                // Find it in the pictures array, and add it to the favorites

                var favorites = this.state.favorites,
                    pictures = this.state.pictures;

                for (var i = 0; i < pictures.length; i++) {

                    // Find the id in the pictures array

                    if (pictures[i].id == id) {

                        if (pictures[i].favorite) {
                            return this.favoriteClick(id);
                        }

                        // Add the picture to the favorites array,
                        // and mark it as a favorite:

                        favorites.push(pictures[i]);
                        pictures[i].favorite = true;

                        break;
                    }

                }

                // Update the state and trigger a render
                this.setState({pictures: pictures, favorites: favorites});

            },

            favoriteClick: function (id) {

                // Find the picture in the favorites array and remove it. After this,
                // find the picture in the pictures array and mark it as a non-favorite.

                var favorites = this.state.favorites,
                    pictures = this.state.pictures;


                for (var i = 0; i < favorites.length; i++) {
                    if (favorites[i].id == id) break;
                }

                // Remove the picture from favorites array
                favorites.splice(i, 1);


                for (i = 0; i < pictures.length; i++) {
                    if (pictures[i].id == id) {
                        pictures[i].favorite = false;
                        break;
                    }
                }

                // Update the state and trigger a render
                this.setState({pictures: pictures, favorites: favorites});

            },

            render: function () {

                var self = this;

                var pictures = this.state.pictures.map(function (p) {
                    return <Picture ref={p.id} src={p.src} title={p.title} favorite={p.favorite}
                                    onClick={self.pictureClick}/>
                });

                if (!pictures.length) {
                    pictures = <p>Loading images..</p>;
                }

                var favorites = this.state.favorites.map(function (p) {
                    return <Picture ref={p.id} src={p.src} title={p.title} favorite={true}
                                    onClick={self.favoriteClick}/>
                });

                if (!favorites.length) {
                    favorites = <p>Click an image to mark it as a favorite.</p>;
                }

                return (

                    <div>
                        <h1>Popular Instagram pics</h1>

                        <div className="pictures"> {pictures} </div>

                        <h1>Your favorites</h1>

                        <div className="favorites"> {favorites} </div>
                    </div>

                );
            }
        });

        return PictureList;

    });