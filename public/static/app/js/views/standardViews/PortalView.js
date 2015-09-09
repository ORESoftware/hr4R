/**
 * Created by amills001c on 7/9/15.
 */


console.log('loading portalView');

define(
    [
        '#appState',
        '#allModels',
        '#allCollections',
        'form2js',
        'ejs',
        'jquery',
        'underscore',
        'backbone',
        'backbone-validation',
        'require'
    ],


    function (appState, models, collections, form2js, EJS, $, _, Backbone, BackboneValidation,require) {



        var PortalView = Backbone.View.extend({


                defaults: function () {
                    return {
                        collection: collections.users,
                        model: null
                    }
                },


                constructor: function () {
                    this.givenName = '@PortalView';
                    Backbone.View.apply(this, arguments);
                },

                initialize: function (opts) {

                    this.setViewProps(opts);
                    _.bindAll(this, 'render', 'show', 'onChange', 'handleModelSyncSuccess', 'handleModelError');
                    //this.listenTo(this.collection, 'add reset', this.render);
                    //this.listenTo(this.collection, 'change', this.onChange, this);
                    //this.listenTo(this.model, 'sync', this.handleModelSyncSuccess);
                    //this.listenTo(this.model, 'error', this.handleModelError);
                    //this.listenTo(Backbone.Events, 'books:created', this.show);

                },


                show: function () {
                    console.log('heard about BOOKS:CREATED: this:', this);
                },

                onChange: function (msg) {

                },

                render: function () {

                    var self = this;

                    var allTemplates = require('#allTemplates');
                    var allViews = require('#allViews');

                    var template = allTemplates['templates/portalTemplate.ejs'];

                    var ret = EJS.render(template, {});
                    $('#main-div-id').html(ret);


                    return this;
                },

                handleModelSyncSuccess: function () {
                    console.log('model sync success');
                },
                handleModelError: function () {
                    console.log('model error!! in this:', this);
                }
            },

            { //class properties
                //template: template
            }
        );


        return PortalView;

    });

