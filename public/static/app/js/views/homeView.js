/**
 * Created by amills001c on 6/11/15.
 */


console.log('loading homeView');

define(['app/js/collections', 'form2js','ejs','jquery', 'underscore', 'handlebars', 'backbone', 'backbone-validation'],


    function (collections, form2js, EJS, $, _, Handlebars, Backbone, BackboneValidation) {


        var HomeView = Backbone.View.extend({

            //id: 'HomeViewID',
            //tagName: 'HomeViewTagName',
            //className: 'HomeViewClassName',

            model:null,
            collection: collections.users,

            el: '#main-div-id',

            initialize: function () {
                _.bindAll(this, "render");
                this.collection.bind("reset", this.render);
                //this.model.bind('change', this.render);
            },
            render: function () {
                console.log('attempting to render HomeView.');

                var self = this;

                $.ajax({
                    url: 'static/html/ejs/homeTemplate.ejs',
                    type: 'GET',
                    success: function(msg) {
                        var ret = EJS.render(msg, {
                            title:'Welcome to the jungle',
                            //filename: '/static/html/ejs/indexEJSTemplate.ejs'
                        });


                        self.$el.html(ret);
                        //$('body').append(ret);
                        console.log('HomeView rendered');
                    },
                    error: function(err) {
                        console.log('error:',err);
                    }
                });

                return this;
            }
        });


        return HomeView;

    });

