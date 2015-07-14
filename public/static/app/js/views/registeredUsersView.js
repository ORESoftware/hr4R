/**
 * Created by amills001c on 6/15/15.
 */


console.log('loading registeredUsersView');

define(
    [
        '#appState',
        'app/js/allCollections',
        'ejs',
        'jquery',
        'underscore',
        'handlebars',
        'backbone',
        'backbone-validation',
        'text!app/templates/registeredUsersTemplate.ejs'
    ],

    function (appState, collections, EJS, $, _, Handlebars, Backbone, BackboneValidation, template) {


        var RegisteredUsersView = Backbone.View.extend({


                defaults: function () {
                    return {
                        model: null,
                        collection: collections.users,
                        childViews: {
                        }
                    }
                },
                events: {

                },

                constructor: function () {
                    this.givenName = '@RegisteredUsersView';
                    Backbone.View.apply(this, arguments);
                },

                initialize: function (opts) {

                    Backbone.setViewProps(this, opts); //has side effects
                    _.bindAll(this, 'render');
                    //this.listenTo(this.collection, 'change', this.render);
                    //this.listenTo(this.collection, 'add remove reset', this.render);
                },
                render: function () {

                    console.log('attempting to render registeredUsersView.');

                    var data = this.collection.models;
                    var self = this;

                    if (RegisteredUsersView.template == null) {

                        console.log('registeredUsersView template is null, retrieving from server.')

                        $.ajax({
                            url: 'static/html/ejs/registeredUsersTemplate.ejs',
                            type: 'GET',
                            success: function (msg) {
                                RegisteredUsersView.template = msg;
                                renderThis.bind(self)(msg);
                            },
                            error: function (err) {
                                throw err;
                            }
                        });
                    }
                    else {
                        renderThis.bind(this)(RegisteredUsersView.template);
                    }

                    function renderThis($template) {
                        var ret = EJS.render($template, {
                            users: data
                        });

                        self.$el.html(ret);

                        console.log('registeredUsersView rendered');
                    }


                    return this;
                }
            },
            { //class properties
                template: template
            }
        );

        //RegisteredUsersView.template = template;

        return RegisteredUsersView;

    });