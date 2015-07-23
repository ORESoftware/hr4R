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
        'form2js',
        'ijson',
        'rivets',
        'text!app/templates/userProfileTemplate.ejs'
    ],

    function (appState, collections, EJS, $, _, Handlebars, Backbone, BackboneValidation, form2js, IJSON, Rivets, template) {


        var UserProfileView = Backbone.View.extend({

                defaults: function () {
                    return {
                        model: appState.get('currentUser'),
                        collection: collections.jobs,
                        childViews: {}
                    }
                },

                events: {
                    'click #submit-user-profile-update-form-id': 'onClickSubmitForm'
                },

                constructor: function (opts) {
                    this.givenName = '@UserProfileView';
                    Backbone.View.apply(this, arguments);

                    //this.cid = _.uniqueId('view');
                    ////_.extend(this, _.pick(options, viewOptions));
                    ////_.extend(this,opts);
                    //this._ensureElement();
                    //this.initialize.apply(this, arguments);
                },

                initialize: function (opts) {

                    this.setViewProps(opts); //has side effects
                    _.bindAll(this, 'render', 'onClickSubmitForm');
                    //this.listenTo(this.collection, 'change', this.render);
                    //this.listenTo(this.collection, 'add remove reset', this.render);

                    //this.el = $('#main-content-id');
                    //this._ensureElement();
                },
                render: function () {

                    console.log('ATTEMPTING to render userProfileView.');

                    //this.el = $('#main-content-id');
                    //this._ensureElement();

                    var data = this.collection.models;
                    var self = this;

                    if (UserProfileView.template == null) {

                        console.log('userProfileView template is null, retrieving from server.');

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

                        self.$el.html(ret);

                        Rivets.binders.value = {
                            bind: function(el) {
                                var adapter = Rivets.adapters[':'];
                                var model = self.model;
                                var keypath = ':';

                                this.callback = function() {
                                    var value = adapter.get(model, keypath);
                                    adapter.set(model, keypath, !value);
                                    console.log('bind called!');
                                };

                                $(self.el).on('click', this.callback);
                            },

                            unbind: function(el) {
                                $(self.el).off('click', this.callback);
                            },

                            routine: function(el, value) {
                                $(self.el)[value ? 'addClass' : 'removeClass']('enabled')
                            }
                        };

                        Rivets.bind($(self.el).find('#user-view'),{user:self.model});

                        console.log('userProfileView (re)-rendered');
                    }


                    return this;
                },
                onClickSubmitForm: function (event) {
                    event.preventDefault();

                    var self = this;

                    var data = form2js('user-profile-update-form-id', '.', true);

                    console.log('registration data:', data);

                    var userData = data.user;

                    var deferred = $.ajax({
                        type: "POST",
                        url: '/updateUserInfo/' + this.model.get('_id'),
                        dataType: "json",
                        data: userData
                    });


                    deferred.done(function (res) {

                        if (res.error) {
                            setTimeout(function () {
                                alert(IJSON.stringify(res));
                            }, 200);
                        }
                        else if (res.success) { //TODO: I like this convention
                            res = res.success;
                            doUserProfile.bind(self)(res);
                        }
                        else {
                            throw new Error('Unexpected response from server - ' + res);
                        }

                    })
                        .fail(function (msg) {
                            setTimeout(function () {
                                alert("Server error during user login/registration - " + IJSON.stringify(msg));
                            }, 200);
                        })
                        .always(function () {
                            self.render();
                        });


                    function doUserProfile() {

                        alert('do user profile!');

                    }


                }
            },
            { //class properties
                template: template
            }
        );

        return UserProfileView;

    });