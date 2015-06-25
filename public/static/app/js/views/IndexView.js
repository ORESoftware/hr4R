/**
 * Created by amills001c on 6/9/15.
 */


//define(['app/js/collections', 'jquery', '../../../../../bower_components/underscore/underscore', 'handlebars', 'backbone', 'backbone-validation'],


define(['app/js/collections', 'app/js/views/loginView', 'app/js/views/registeredUsersView', 'ejs', 'jquery', 'underscore', 'handlebars', 'backbone', 'backbone-validation'],


    function (collections, LoginView, RegisteredUsersView, EJS, $, _, Handlebars, Backbone, BackboneValidation) {


        var IndexView = Backbone.View.extend({

            el: '#main-div-id',

            template:null,

            model: null,
            collection: collections.users,

            childLoginView: null,
            childRegisteredUsersView: null,

            events: {
                'click #loginAsGuest': 'onLoginAsGuest',
                'click #accountRecoveryId': 'onAccountRecovery'
            },

            initialize: function () {

                _.bindAll(this, 'render');

                this.listenTo(this.collection,'reset',this.render);
                this.collection.fetch({
                    success: this.onFetchSuccess.bind(this),
                    error: this.onFetchFailure.bind(this)
                });
            },

            //http://stackoverflow.com/questions/7113049/backbone-js-nesting-views-through-templating

            render: function () {
                console.log('attempting to render IndexView.');

                var data = this.collection.models;

                if(this.template == null){

                    var self = this;

                    $.ajax({
                        url: 'static/html/ejs/indexTemplate.ejs',
                        type: 'GET',
                        success: function (msg) {

                            self.template = msg;
                            renderChildren(msg);

                        },
                        error: function (err) {
                            console.log('error:', err);
                        }
                    });

                }
                else{
                    renderChildren.bind(this)(this.template);
                }

                function renderChildren($template){
                    var ret = EJS.render($template, {
                        users: data
                    });

                    self.$el.html(ret);

                    self.childLoginView = new LoginView({el: self.$('#child-view-login-container')});
                    //console.log('this.childLoginView.$el', self.childLoginView.$el);
                    self.childLoginView.render();
                    self.childLoginView.delegateEvents();

                    self.childRegisteredUsersView = new RegisteredUsersView({el: self.$('#child-view-registered-users-container')});
                    //console.log('this.childRegisteredUsersView.$el', self.childRegisteredUsersView.$el);
                    self.childRegisteredUsersView.render();
                    self.childRegisteredUsersView.delegateEvents();

                    console.log('IndexView rendered');
                }

                return this;

            },

            onFetchSuccess: function () {
                console.log('Successfully fetched IndexView collection (users).');
                //console.log('this.collection:', this.collection);
                //console.log('this.collection.models:', this.collection.models);
                //this.render();
            },

            onFetchFailure: function () {
                alert('failed to fetch IndexView collection.');
            }
        });


        return IndexView;

    });