/**
 * Created by amills001c on 9/9/15.
 */


define(
    [
        '#appState',
        '#allCollections',
        'ejs',
        'jquery',
        'underscore',
        'backbone',
        'react'
    ],

    function (appState, collections, EJS, $, _, Backbone, React) {


        var GenericView = Backbone.View.extend({


                initialize: function (opts) {

                    this.setViewProps(opts); //has side effects
                    _.bindAll(this, 'render');

                },

                renderReactComponents: function(){


                },

                render: function () {


                    return this;
                }
            },
            { //class properties

            });

        return GenericView;
    });



