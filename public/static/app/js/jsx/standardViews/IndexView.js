/**
 * Created by amills001c on 6/9/15.
 */


//TODO: http://codebeerstartups.com/2012/12/5-explaining-views-in-backbone-js-learning-backbone-js/


define(
    [
        '#appState',
        '#allCollections',
        //'#allStandardViews',
        'ejs',
        'jquery',
        'underscore',
        'backbone',
        'backbone-validation',
        'text!app/templates/indexTemplate.ejs'
    ],


    function (appState, collections, EJS, $, _, Backbone, BackboneValidation, template) {


        //var LoginView = standardViews.Login;
        //var RegisteredUsersView = standardViews.RegisteredUsers;

        var IndexView = Backbone.View.extend({


                //el: '#main-div-id',

                defaults: function () {
                    return {
                        model: null,
                        collection: collections.users,
                        childViews: {
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

                    this.setViewProps(opts); //has side effects
                    _.bindAll(this, 'render', 'onFetchSuccess', 'onFetchFailure');
                    //this.listenTo(this.collection, 'add remove reset', this.render);
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

                    var ret = EJS.render(IndexView.template, {
                        users: data
                    });

                    this.$el.html(ret);


                    require(['#allStandardViews'],function(standardViews){

                        self.childViews.childLoginView = new standardViews.Login({el: this.$('#child-view-login-container')});
                        //this.childViews.childLoginView = new LoginView({el: $('#child-view-login-container')});
                        self.childViews.childLoginView.render();
                        self.childViews.childLoginView.delegateEvents();

                        self.childViews.childRegisteredUsersView = new standardViews.RegisteredUsers({el: this.$('#child-view-registered-users-container')});
                        //this.childViews.childRegisteredUsersView = new RegisteredUsersView({el: $('#child-view-registered-users-container')});
                        self.childViews.childRegisteredUsersView.render();
                        self.childViews.childRegisteredUsersView.delegateEvents();
                    });

                    console.log('IndexView rendered');

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
                template: template
            });


        //IndexView.template = template;

        return IndexView;

    });




