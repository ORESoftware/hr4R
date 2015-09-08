/**
 * Created by denman on 7/25/2015.
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


        var PictureView = Backbone.View.extend({

                initialize: function (opts) {

                    this.setViewProps(opts); //has side effects
                    _.bindAll(this, 'render');
                },

                render: function () {

                    var self = this;


                    var allTemplates = require('#allTemplates');
                    var allViews = require('#allViews');

                    var template = allTemplates['templates/pictureTemplate.ejs'];
                    var PictureList = allViews['reactComponents/PictureList'];

                    var ret = EJS.render(template, {});

                    self.$el.html(ret);

                    React.render(
                        React.createElement(PictureList, {apiKey: "642176ece1e7445e99244cec26f4de1f"}),
                        $(self.el).find('#picture-list-example-div-id')[0]
                    );

                    //TODO: make React.render work with this.el or this.$el

                    return this;

                }
            },
            {
                //template: template
            });


        return PictureView;

    });

