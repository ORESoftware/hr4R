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
        '#allTemplates'
        //'text!app/templates/portal.ejs'
    ],


    function (appState, models, collections, form2js, EJS, $, _, Backbone, BackboneValidation, allTemplates) {


        var template = allTemplates['templates/portalTemplate.ejs'];


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
                    console.log('attempting to render PortalView.');

                    var self = this;

                    var ret = EJS.render(PortalView.template, {});
                    $('#main-div-id').html(ret);
                    console.log('PortalView (re)rendered');

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
                template: template
            }
        );


        return PortalView;

    });

