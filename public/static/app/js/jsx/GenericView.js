/**
 * Created by denmanm1 on 9/9/15.
 */


define(
    [
        '+appState',
        '#allCollections',
        'ejs',
        'underscore',
        'react'
    ],

    function (appState, collections, EJS, _, React) {


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



