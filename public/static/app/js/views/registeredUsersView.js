/**
 * Created by amills001c on 6/15/15.
 */


console.log('loading registeredUsersView');

//TODO: http://hackflow.com/blog/2015/03/08/boiling-react-down-to-few-lines-in-jquery/

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
        'app/js/Adhesive',
        'text!app/templates/registeredUsersTemplate.ejs'
    ],

    function (appState, collections, EJS, $, _, Handlebars, Backbone, BackboneValidation, Adhesive, template) {


        var RegisteredUsersView = Backbone.View.extend({


                defaults: function () {
                    return {
                        model: null,
                        collection: collections.users,
                        childViews: {}
                    }
                },
                events: {

                },

                constructor: function () {
                    this.givenName = '@RegisteredUsersView';
                    Backbone.View.apply(this, arguments);
                },

                initialize: function (opts) {

                    this.setViewProps(opts); //has side effects
                    _.bindAll(this, 'render');
                    //this.listenTo(this.collection, 'change', this.render);
                    //this.listenTo(this.collection, 'add remove reset', this.render);

                    this.adhesive = new Adhesive(this, {});

                    //this.adhesive.bind('user',this.model,null,this.$el,'keyup');

                    var self = this;

                    this.adhesive.bind({
                        keyName: 'user',
                        models: {
                            //listenTo: [self.model],
                            //update: [self.model],
                            listenTo: [],
                            update: [],
                            modelEvent: 'change'
                        },
                        collections: {
                            listenTo: [self.collection],
                            update: [self.collection],
                            //listenTo: [],
                            //update: [],
                            collectionEvent: 'model-change',
                            where: {}
                        },
                        limitToEventTarget:true,
                        domElementListen: self.$el,
                        domElementUpdate: $(document),
                        domEventType: 'keyup',
                        callback: null
                    });

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

        return RegisteredUsersView;

    });