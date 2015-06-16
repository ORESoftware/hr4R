/**
 * Created by amills001c on 6/15/15.
 */



define(['app/js/collections', 'ejs', 'jquery', 'underscore', 'handlebars', 'backbone', 'backbone-validation'],


    function (collections, EJS, $, _, Handlebars, Backbone, BackboneValidation) {


        var RegisteredUsersView = Backbone.View.extend({

            model: null,
            collection: collections.users,

            initialize: function () {
                _.bindAll(this, "render");
                this.collection.bind("reset", this.render);
            },
            render: function () {

                console.log('attempting to render ListUsersView.');

                var data = this.collection.models;
                var self = this;

                $.ajax({
                    url: 'static/html/ejs/registeredUsersTemplate.ejs',
                    type: 'GET',
                    success: function (msg) {
                        var ret = EJS.render(msg, {
                            title: 'Welcome to the jungle',
                            users: data
                        });

                        self.$el.html(ret);

                        console.log('IndexView rendered');
                    },
                    error: function (err) {
                        console.log('error:', err);
                    }
                });

                return this;
            }
        });

        return RegisteredUsersView;

    });