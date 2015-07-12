/**
 * Created by amills001c on 6/9/15.
 */


//TODO: http://codebeerstartups.com/2012/12/5-explaining-views-in-backbone-js-learning-backbone-js/


define(
    [
        '#appState',
        'app/js/allCollections',
        'app/js/views/loginView',
        'app/js/views/registeredUsersView',
        'ejs',
        'jquery',
        'underscore',
        'handlebars',
        'backbone',
        'backbone-validation',
        'text!app/templates/indexTemplate.ejs'
    ],


    function (appState, collections, LoginView, RegisteredUsersView, EJS, $, _, Handlebars, Backbone, BackboneValidation, template) {


        var IndexView = Backbone.View.extend({


                el: '#main-div-id',

                defaults: function(){
                    return{
                        model: null,
                        collection: collections.users,
                        childViews:{
                            childLoginView: null,
                            childRegisteredUsersView: null
                        }
                    }
                },

                //TODO: should events also be a function to prevent all instances sharing same events?

                events: {
                    'click #loginAsGuest': 'onLoginAsGuest',
                    'click #accountRecoveryId': 'onAccountRecovery'
                },


                constructor: function () {
                    this.givenName = '@IndexView';
                    Backbone.View.apply(this, arguments);
                },

                initialize: function (opts) {

                    Backbone.setViewProps(this,opts); //has side effects
                    _.bindAll(this, 'render', 'onFetchSuccess', 'onFetchFailure');
                    this.listenTo(this.collection, 'add remove reset', this.render);
                    this.collection.fetch({
                        success: this.onFetchSuccess.bind(this),
                        error: this.onFetchFailure.bind(this)
                    });
                },

                //http://stackoverflow.com/questions/7113049/backbone-js-nesting-views-through-templating

                render: function () {
                    console.log('attempting to render IndexView.');


                    var data = this.collection.models;

                    var self = this;

                    if (IndexView.template == null) {

                        console.log('indexView template is null, retrieving from server.')

                        $.ajax({
                            url: 'static/html/ejs/indexTemplate.ejs',
                            type: 'GET',
                            success: function (msg) {

                                IndexView.template = msg;
                                renderChildren.bind(self)(msg);

                            },
                            error: function (err) {
                                console.log('error:', err);
                            }
                        });

                    }
                    else {
                        renderChildren.bind(self)(IndexView.template);
                    }


                    function renderChildren($template) {
                        var ret = EJS.render($template, {
                            users: data
                        });
                        //

                        this.$el.html(ret);

                        this.childViews.childLoginView = new LoginView({el: this.$('#child-view-login-container')});
                        this.childViews.childLoginView.render();
                        this.childViews.childLoginView.delegateEvents();

                        this.childViews.childRegisteredUsersView = new RegisteredUsersView({el: this.$('#child-view-registered-users-container')});
                        this.childViews.childRegisteredUsersView.render();
                        this.childViews.childRegisteredUsersView.delegateEvents();


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
            },
            { //class properties
                template:template
            });


        //IndexView.template = template;

        return IndexView;

    });




