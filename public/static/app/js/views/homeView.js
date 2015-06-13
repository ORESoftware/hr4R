/**
 * Created by amills001c on 6/11/15.
 */


define(['app/js/collections', 'ejs','jquery', 'underscore', 'handlebars', 'backbone', 'backbone-validation'],


    function (collections, EJS, $, _, Handlebars, Backbone, BackboneValidation) {


        var HomeView = Backbone.View.extend({

            id: 'HomeViewID',
            tagName: 'HomeViewTagName',
            className: 'HomeViewClassName',

            collection: collections.users,

            el: '#main-div-id',

            initialize: function () {
                _.bindAll(this, "render");
                this.collection.bind("reset", this.render);
                //this.model.bind('change', this.render);
            },
            render: function () {
                console.log('attempting to render HomeView.');

                var data  = [{'username':'denman','firstName': 'alex', 'lastName': 'mills'},
                    {'username':'donald','firstName': 'duck', 'lastName': 'goose'}];

                var self = this;

                $.ajax({
                    url: 'static/html/ejs/indexEJSTemplate.ejs',
                    type: 'GET',
                    success: function(msg) {
                        var ret = EJS.render(msg, {
                            title:'Welcome to the jungle',
                            users: data
                            //filename: '/static/html/ejs/indexEJSTemplate.ejs'
                        });

                        console.log(ret);

                        self.$el.html(ret);
                        //$('body').append(ret);
                        console.log('HomeView rendered');
                    },
                    error: function(err) {
                        console.log('error:',err);
                    }
                });


                return this;


                //this.$el.append(rendered);
                //$('#main-div-id').append(rendered);
            }
        });


        return HomeView;

    });

