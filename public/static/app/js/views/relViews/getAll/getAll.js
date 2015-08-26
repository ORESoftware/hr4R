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
        'jsx!app/js/views/reactComponents/listView',
        '#allTemplates'
        //'text!app/templates/GetAllTemplate.ejs'
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

                render: function () {

                    var self = this;

                    //var ret = EJS.render(GetAllView.template, {
                    //    model: self.model,
                    //    collection: self.collection
                    //});
                    //
                    //self.$el.html(ret);

                    //var listView = ListView(self.collection);


                    React.render(
                        //<ListView items={ ['Home', 'Services', 'About', 'Contact us'] }/>,
                        <ListView items={ self.collection.models }/>,
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

