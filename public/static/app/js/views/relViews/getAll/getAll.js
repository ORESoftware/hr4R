/**
 * Created by amills001c on 8/5/15.
 */


define(
    [
        '#appState',
        '#allCollections',
        'ejs',
        'jquery',
        'underscore',
        'app/js/Adhesive',
        'backbone',
        'react',
        'app/js/jsx/reactComponents/listView',
        '#allTemplates'
    ],


    function (appState, collections, EJS, $, _, Adhesive, Backbone, React, ListView, allTemplates) {

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

                render: function (cb) {

                    var self = this;


                    React.render(
                        //<ListView items={ ['Home', 'Services', 'About', 'Contact us'] }/>,
                        <ListView items={ self.collection.models }/>,
                        self.el
                    );

                    //TODO: make React.render work with this.el or this.$el
                    if(typeof cb === 'function'){
                        cb();
                    }
                }
            },
            {
                template: template
            });


        return GetAllView;

    });

