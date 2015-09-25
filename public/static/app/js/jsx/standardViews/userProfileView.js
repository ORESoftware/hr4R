/**
 * Created by denmanm1 on 7/16/15.
 */

/**
 * Created by denmanm1 on 6/15/15.
 */


console.log('loading userProfileView');

define(
    [
        '+appState',
        '#allCollections',
        'ejs',
        'underscore',
        'backbone-validation',
        'form2js',
        'ijson',
        '#Adhesive'
    ],

    function (appState, collections, EJS, _, BackboneValidation, form2js, IJSON, Adhesive) {


        var UserProfileView = Backbone.View.extend({

                defaults: function () {

                    window.currentUser = appState.get('currentUser');
                    return {
                        model: window.currentUser,
                        collection: collections.users,
                        childViews: {}
                    }
                },

                events: {
                    'click #submit-user-profile-update-form-id': 'onClickSubmitForm'
                },

                constructor: function (opts) {
                    this.givenName = '@UserProfileView';
                    Backbone.View.apply(this, arguments);

                },

                initialize: function (opts) {

                    this.setViewProps(opts); //has side effects
                    _.bindAll(this, 'render', 'onClickSubmitForm');

                    //this.listenTo(this.collection, 'change', this.render);
                    //this.listenTo(this.collection, 'add remove reset', this.render);

                },
                render: function (cb) {

                    var self = this;

                    var allTemplates = require('#allTemplates');
                    var allViews = require('#allViews');

                    var template = allTemplates['templates/userProfileTemplate.ejs'];

                    var ret = EJS.render(template, {
                        user: self.model,
                        model: self.model,
                        collection: self.collection
                    });

                    self.$el.html(ret);

                    return this;

                },

                onClickSubmitForm: function (event) {
                    event.preventDefault();

                    var self = this;

                    //var data = form2js('user-profile-update-form-id', '.', true);
                    //
                    //console.log('registration data:', data);
                    //
                    //var userData = data.user;

                    var data = this.model.attributes;

                    var deferred = $.ajax({
                        type: "POST",
                        url: '/updateUserInfo/' + this.model.get('_id'),
                        dataType: "json",
                        data: data
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
                //template: template
            }
        );

        return UserProfileView;

    });