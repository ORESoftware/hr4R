/**
 * Created by denmanm1 on 8/25/15.
 */


//TODO: (Backbone views are "controller-views" in flux architecture): https://facebook.github.io/flux/docs/overview.html
//TODO: http://codebeerstartups.com/2012/12/5-explaining-views-in-backbone-js-learning-backbone-js/
//TODO: http://stackoverflow.com/questions/7113049/backbone-js-nesting-views-through-templating
//TODO: https://github.com/facebook/flux/tree/master/examples/flux-todomvc/js

//var viewOptions = ['model', 'collection', 'el', 'id', 'attributes', 'className', 'tagName', 'events'];

define(
    [
        '+appState',
        '#allCollections',
        'ejs',
        'underscore',
        'react'
    ],

    function (appState, collections, EJS, _, React) {


        var BaseView = Backbone.View.extend({


                initialize: function (opts) {

                    this.setViewProps(opts); //has side effects
                    _.bindAll(this, 'render');

                },

                render: function () {

                    return this;

                }
            },
            { //class properties

            });

        return BaseView;
    });




