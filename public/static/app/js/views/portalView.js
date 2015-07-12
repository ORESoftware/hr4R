/**
 * Created by amills001c on 7/9/15.
 */


console.log('loading portalView');

define(
    [
        '#appState',
        'app/js/allModels',
        'app/js/allCollections',
        'form2js',
        'ejs',
        'jquery',
        'underscore',
        'handlebars',
        'backbone',
        'backbone-validation',
        'text!app/templates/portal.ejs'
    ],


    function (appState, models, collections, form2js, EJS, $, _, Handlebars, Backbone, BackboneValidation, template) {


        var PortalView = Backbone.View.extend({

                //id: 'PortalViewID',
                //tagName: 'PortalViewTagName',
                //className: 'PortalViewClassName',


                defaults: function(){
                    return{
                        collection: collections.users,
                        model:null
                    }
                },

                el: '#main-div-id',

                constructor: function () {
                    this.givenName = '@PortalView';
                    Backbone.View.apply(this, arguments);
                },

                initialize: function (opts) {

                    Backbone.setViewProps(this,opts);
                    _.bindAll(this, 'render', 'show', 'onChange', 'handleModelSyncSuccess', 'handleModelError');
                    this.listenTo(this.collection, 'add reset', this.render);
                    this.listenTo(this.collection, 'change', this.onChange, this);
                    this.listenTo(this.model, 'sync', this.handleModelSyncSuccess);
                    this.listenTo(this.model, 'error', this.handleModelError);
                    this.listenTo(Backbone, 'books:created', this.show);
                },


                show: function () {
                    console.log('heard about BOOKS:CREATED: this:', this);
                },

                onChange: function (msg) {

                    console.log(msg);
                },


                render: function () {
                    console.log('attempting to render PortalView.');

                    var self = this;

                    if (PortalView.template == null) {

                        console.log('PortalView template is null, retrieving from server.')

                        $.ajax({
                            url: 'static/html/ejs/portal.ejs',
                            type: 'GET',
                            success: function (msg) {
                                PortalView.template = msg;
                                renderThis.bind(self)(msg);
                            },
                            error: function (err) {
                                console.log('error:', err);
                            }
                        });
                    }
                    else {
                        renderThis.bind(self)(PortalView.template);
                    }

                    function renderThis($template) {

                        var ret = EJS.render($template, {});

                        self.$el.html(ret);
                        console.log('PortalView (re)rendered');
                    }

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
                template:template
            }
        );


        return PortalView;

    });

