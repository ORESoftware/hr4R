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
        'text!app/templates/userProfileTemplate.ejs'
    ],

    function (appState, collections, EJS, $, _, Handlebars, Backbone, BackboneValidation, form2js, template) {


        var UserProfileView = Backbone.View.extend({

                //el: '#main-content-id',

                defaults: function () {
                    return {
                        model: null,
                        collection: collections.jobs,
                        childViews: {}
                    }
                },

                events: {
                    //'click #logout-button-id': 'onClickLogout',
                    'click #submit-user-profile-update-form-id': 'onClickSubmitForm'
                },

                //constructor: function (opts) {
                //    this.givenName = '@UserProfileView';
                //    //Backbone.View.apply(this, arguments);
                //
                //    this.cid = _.uniqueId('view');
                //    //_.extend(this, _.pick(options, viewOptions));
                //    //_.extend(this,opts);
                //    this._ensureElement();
                //    this.initialize.apply(this, arguments);
                //},

                initialize: function (opts) {

                    this.setViewProps(opts); //has side effects
                    _.bindAll(this, 'render', 'onClickSubmitForm');
                    //this.listenTo(this.collection, 'change', this.render);
                    //this.listenTo(this.collection, 'add remove reset', this.render);
                },
                render: function () {

                    console.log('attempting to render userProfileView.');

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

                        //self.$el.append(ret);
                        //console.log(ret);
                        //self.$el.append(ret);

                        $(self.el).html(ret);

                        console.log('userProfileView (re)-rendered');
                    }


                    return this;
                },
                onClickSubmitForm: function (event) {
                    event.preventDefault();

                    var self = this;

                    var data = form2js('user-profile-update-form-id', '.', true);

                    console.log('registration data:', data);

                    $.ajax({
                        type: "POST",
                        url: '/updateUserInfo/' + this.model._id,
                        dataType: "json",
                        data: data
                    })

                        .done(function (res) {

                            if (res.error) {
                                setTimeout(function () {
                                    alert(res);
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
                                alert("Server error during user login/registration - " + msg);
                            }, 200);
                        })
                        .always(function () {
                            self.render();
                        });


                    function doUserProfile() {

                    }


                }
            },
            { //class properties
                template: template
            }
        );

        return UserProfileView;

    });