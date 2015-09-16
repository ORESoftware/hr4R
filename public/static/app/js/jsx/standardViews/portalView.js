/**
 * Created by amills001c on 7/9/15.
 */


console.log('loading portalView');

define(
    [
        '+appState',
        '#allModels',
        '#allCollections',
        'form2js',
        'ejs',
        'underscore',
        'backbone-validation',
        '@eventBus',
        'require'
    ],


    function (appState, models, collections, form2js, EJS, _, BackboneValidation, eventBus, require) {


        var PortalView = Backbone.View.extend({


                defaults: function () {
                    return {
                        collection: collections.users,
                        model: null
                    }
                },

                events: {
                    'click #logout-li-id': 'onClickLogout'
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

                    var self = this;

                    $('#logout-li-id').on('click', function (event) {
                        event.preventDefault();
                        self.onClickLogout(event);
                    });

                    $('li').on('click', function (event) {
                        event.preventDefault();
                        self.onClickLogout(event);
                    });

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

                onClickLogout: function (event) {
                    event.preventDefault();

                    //TODO: for some reason the server is logging this POST request as occuring twice or more, why?
                    var self = this;

                    $.ajax({
                        url: '/logout',
                        data: {},
                        dataType: 'json',
                        type: 'POST'

                    }).done(function (msg, textStatus, jqXHR) {
                        if (msg === true) {
                            appState.set('currentUser', null);
                            eventBus.trigger('bootRouter', 'index');
                        }
                        else {
                            alert('logout failed on server, please try again.')
                        }

                    }).fail(function (jqXHR, textStatus, errorThrown) {
                        console.log('error:', err);
                        alert('internal server error - logout failed.')

                    }).always(function (a, textStatus, b) {
                        self.render();
                    });
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

