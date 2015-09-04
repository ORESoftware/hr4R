/**
 * Created by amills001c on 6/9/15.
 */


//TODO: http://codebeerstartups.com/2012/12/5-explaining-views-in-backbone-js-learning-backbone-js/


define(
    [
        '#appState',
        '#allCollections',
        'ejs',
        'jquery',
        'underscore',
        'backbone',
        'backbone-validation'
    ],


    function (appState, collections, EJS, $, _, Backbone, BackboneValidation) {


        var IndexView = Backbone.View.extend({

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

                render: function (cb) {

                    var data = this.collection.models;
                    var self = this;


                    require(['#allTemplates','#allStandardViews'],function(allTemplates,asv){

                        var template = allTemplates['templates/indexTemplate.ejs'];

                        var ret = EJS.render(template, {
                            users: data
                        });

                        self.$el.html(ret);

                        self.childViews.childLoginView = new asv['loginView']({el: self.$('#child-view-login-container')});
                        self.childViews.childLoginView.render();
                        self.childViews.childLoginView.delegateEvents();

                        self.childViews.childRegisteredUsersView = new asv['registeredUsersView']({el: self.$('#child-view-registered-users-container')});
                        self.childViews.childRegisteredUsersView.render();
                        self.childViews.childRegisteredUsersView.delegateEvents();

                        if(typeof cb === 'function'){
                            cb();
                        }
                    },
                    function(err){
                        console.error(err);
                        throw err;
                    });
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
                //template: template
            });


        //IndexView.template = template;

        return IndexView;

    });




