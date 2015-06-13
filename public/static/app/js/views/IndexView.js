/**
 * Created by amills001c on 6/9/15.
 */


//define(['app/js/collections', 'jquery', '../../../../../bower_components/underscore/underscore', 'handlebars', 'backbone', 'backbone-validation'],


define(['app/js/collections', 'app/js/views/loginView', 'ejs', 'jquery', 'underscore', 'handlebars', 'backbone', 'backbone-validation'],


    function (collections, LoginView, EJS, $, _, Handlebars, Backbone, BackboneValidation) {


        var IndexView = Backbone.View.extend({

            el: '#main-div-id',

            childView: new LoginView(),

            events: {
                'click #loginAsGuest': 'onLoginAsGuest',
                'click #accountRecoveryId': 'onAccountRecovery'
            },

            initialize: function () {
                _.bindAll(this, "render");
                this.collection.bind("reset", this.render);
                //this.model.bind('change', this.render);
                this.collection.fetch({
                    success: this.onFetchSuccess.bind(this),
                    error: this.onFetchFailure.bind(this)
                });
            },
            render: function () {
                console.log('attempting to render IndexView.');

                //this.$el.html(this.template(this.model.toJSON()));
                this.childView.$el = this.$('#child-view-container');
                console.log('this.childView.$el',this.childView.$el);
                this.childView.render();
                this.childView.delegateEvents();

                var data = this.collection.items;

                //TODO:users are in database but not showing up on index page

                if(!data){
                    data = [];
                }

                var self = this;

                $.ajax({
                    url: 'static/html/ejs/indexTemplate.ejs',
                    type: 'GET',
                    success: function (msg) {
                        var ret = EJS.render(msg, {
                            title: 'Welcome to the jungle',
                            users: data
                            //filename: '/static/html/ejs/indexEJSTemplate.ejs'
                        });

                        console.log(ret);

                        self.$el.html(ret);
                        //$('body').append(ret);
                        console.log('IndexView rendered');
                    },
                    error: function (err) {
                        console.log('error:', err);
                    }
                });


                return this;

            },

            onFetchSuccess: function () {
                this.render();
            },

            onFetchFailure: function () {
                alert('failed to fetch IndexView collection.');
            }
        });


        return new IndexView({
            collection: collections.users
        })

    });