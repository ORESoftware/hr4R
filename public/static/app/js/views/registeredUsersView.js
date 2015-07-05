/**
 * Created by amills001c on 6/15/15.
 */


console.log('loading registeredUsersView');

define(
    [
        '#appState',
        'app/js/collections',
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

            className:'RegisteredUsersView',

            model: null,
            collection: collections.users,

            initialize: function () {
                //_.bind(this.initialize,undefined);
                _.bindAll(this, 'render');
               this.listenTo(this.collection,'change',this.render);
            },
            render: function () {

                console.log('attempting to render registeredUsersView.');

                var data = this.collection.models;
                var self = this;

                if(RegisteredUsersView.template == null){

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
                else{
                    renderThis.bind(this)(RegisteredUsersView.template);
                }

                function renderThis($template){
                    var ret = EJS.render($template, {
                        users: data
                    });

                    self.$el.html(ret);

                    console.log('registeredUsersView rendered');
                }


                return this;
            }
        });

        RegisteredUsersView.template = template;

        return RegisteredUsersView;

    });