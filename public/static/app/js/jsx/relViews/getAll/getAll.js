/**
 * Created by denmanm1 on 8/5/15.
 */


define(
    [
        '+appState',
        '#allCollections',
        'ejs',
        'underscore',
        '#Adhesive',
        'react',
        'app/js/jsx/reactComponents/listView',
        '#allTemplates'
    ],


    function (appState, collections, EJS, _, Adhesive, React, ListView, allTemplates) {

        var template = allTemplates['templates/getAllTemplate.ejs'];

        var GetAllView = Backbone.View.extend({

                defaults: function () {

                    return {
                        model: null,
                        collection: null,
                        childViews: {}
                    }
                },

                initialize: function (opts) {

                    this.setViewProps(opts); //has side effects
                    _.bindAll(this, 'render');

                    //var JobModel = this.collection.model;

                    //this.model = new JobModel();

                },

                render: function () {

                    var self = this;

                    var allTemplates = require('#allTemplates');
                    var allViews = require('#allViews');

                    var ListView = allViews['reactComponents/listView'];

                    //<ListView items={ ['Home', 'Services', 'About', 'Contact us'] }/>,
                    React.render(
                        React.createElement(ListView, {items:  self.collection.models}),
                        self.el
                    );

                    //TODO: make React.render work with this.el or this.$el

                    return this;

                }
            },
            {
                template: template
            });


        return GetAllView;

    });

