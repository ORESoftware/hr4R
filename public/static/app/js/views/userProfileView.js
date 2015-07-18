/**
 * Created by amills001c on 7/16/15.
 */

/**
 * Created by amills001c on 6/15/15.
 */


console.log('loading userProfileView');

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
        'text!app/templates/userProfileTemplate.ejs'
    ],

    function (appState, collections, EJS, $, _, Handlebars, Backbone, BackboneValidation, template) {


        var UserProfileView = Backbone.View.extend({


                defaults: function () {
                    return {
                        model: null,
                        collection: collections.users,
                        childViews: {
                        }
                    }
                },
                events: {

                },

                constructor: function (opts) {
                    this.givenName = '@UserProfileView';
                    //this.cid = _.uniqueId('view');
                    Backbone.setViewProps(this, opts); //has side effects
                    this._ensureElement();
                    this.initialize.apply(this, arguments);
                    //Backbone.View.apply(this, arguments);
                },

                initialize: function (opts) {

                    //Backbone.setViewProps(this, opts); //has side effects
                    _.bindAll(this, 'render');
                    //this.listenTo(this.collection, 'change', this.render);
                    //this.listenTo(this.collection, 'add remove reset', this.render);
                },
                render: function () {

                    console.log('attempting to render userProfileView.');

                    var data = this.collection.models;
                    var self = this;

                    if (UserProfileView.template == null) {

                        console.log('userProfileView template is null, retrieving from server.')

                        $.ajax({
                            url: 'static/html/ejs/userProfileTemplate.ejs',
                            type: 'GET',
                            success: function (msg) {
                                UserProfileView.template = msg;
                                renderThis.bind(self)(msg);
                            },
                            error: function (err) {
                                throw err;
                            }
                        });
                    }
                    else {
                        renderThis.bind(this)(UserProfileView.template);
                    }

                    function renderThis($template) {
                        var ret = EJS.render($template, {
                            users: data
                        });

                        //self.$el.append(ret);
                        //console.log(ret);
                        self.$el.html(ret);

                        //$(self.el).append(ret);

                        console.log('userProfileView (re)-rendered');
                    }

                    return this;
                }
            },
            { //class properties
                template: template
            }
        );

        return UserProfileView;

    });