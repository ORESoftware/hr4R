/**
 * Created by amills001c on 6/15/15.
 */


console.log('loading registeredUsersView');

//TODO: http://hackflow.com/blog/2015/03/08/boiling-react-down-to-few-lines-in-jquery/

define(
    [
        '#appState',
        '#allCollections',
        'ejs',
        'jquery',
        'underscore',
        'backbone',
        'backbone-validation',
        'app/js/Adhesive'
    ],

    function (appState, collections, EJS, $, _, Backbone, BackboneValidation, Adhesive) {


        var RegisteredUsersView = Backbone.View.extend({


                defaults: function () {
                    return {
                        model: null,
                        collection: collections.users,
                        childViews: {}
                    }
                },
                events: {},

                constructor: function () {
                    this.givenName = '@RegisteredUsersView';
                    Backbone.View.apply(this, arguments);
                },

                initialize: function (opts) {

                    this.setViewProps(opts);
                    _.bindAll(this, 'render');
                    this.listenTo(this.collection, 'change', this.render);
                    this.listenTo(this.collection, 'add remove reset', this.render);

                    //this.adhesive = new Adhesive(this, {});
                    //
                    //var self = this;
                    //
                    //this.adhesive.stick({
                    //    keyName: 'user',
                    //    models: {
                    //        //listenTo: [self.model],
                    //        //update: [self.model],
                    //        listenTo: [],
                    //        update: [],
                    //        modelEvents: ['change']
                    //    },
                    //    collections: {
                    //        listenTo: [self.collection],
                    //        update: [self.collection],
                    //        //listenTo: [],
                    //        //update: [],
                    //        collectionEvents: ['coll-change','coll-add'],
                    //        where: {}
                    //    },
                    //    listenToClass: 'className',
                    //    limitToEventTarget: true,
                    //    domElementListen: self.$el,
                    //    domElementUpdate: $(document),
                    //    domEventType: 'keyup',
                    //    callback: null
                    //});

                },
                render: function () {

                    var self = this;

                    require(['#allTemplates', '#allReactComponents'], function (allTemplates, allReactComponents) {

                        var data = self.collection.models;

                        var template = allTemplates['templates/registeredUsersTemplate.ejs'];

                        var ret = EJS.render(template, {
                            users: data,
                            model: self.model,
                            collection: self.collection
                        });

                        self.$el.html(ret);

                        if (typeof cb === 'function') {
                            cb();
                        }

                    }, function (err) {
                        console.error(err);
                        throw err;
                    });

                }
            },
            { //class properties
                //template: template
            }
        );

        return RegisteredUsersView;

    });