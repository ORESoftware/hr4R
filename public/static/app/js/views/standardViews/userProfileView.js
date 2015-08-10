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
        '#allCollections',
        'ejs',
        'jquery',
        'underscore',
        'handlebars',
        'backbone',
        'backbone-validation',
        'form2js',
        'ijson',
        'app/js/Adhesive',
        'text!app/templates/userProfileTemplate.ejs'
    ],

    function (appState, collections, EJS, $, _, Handlebars, Backbone, BackboneValidation, form2js, IJSON, Adhesive, template) {


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

                    //this.cid = _.uniqueId('view');
                    ////_.extend(this, _.pick(options, viewOptions));
                    ////_.extend(this,opts);
                    //this._ensureElement();
                    //this.initialize.apply(this, arguments);
                },

                initialize: function (opts) {

                    this.setViewProps(opts); //has side effects
                    _.bindAll(this, 'render', 'onClickSubmitForm');

                    this.adhesive = new Adhesive(this, {});

                    var self = this;

                    //this.adhesive.stick({
                    //    keyName: 'user',
                    //    models: {
                    //        //listenTo: [self.model],
                    //        //update: [self.model],
                    //        listenTo: [self.model],
                    //        update: [self.model],
                    //        modelEvents: ['model-local-change-broadcast'],
                    //        where: {}
                    //    },
                    //    collections: {
                    //        listenTo: [self.collection],
                    //        update: [self.collection],
                    //        //listenTo: [],
                    //        //update: [],
                    //        collectionEvents: ['coll-socket-change-broadcast']
                    //        //where: {cid:self.model.cid},
                    //        //filterUpdate: function(model){
                    //        //    return model.cid == self.model.cid;
                    //        //},
                    //        //filterListenTo: function(model){
                    //        //    return model.cid == self.model.cid;
                    //        //}
                    //    },
                    //    limitToEventTarget:true, //will limit updates for just the element touched
                    //    //limitToClass: 'barf',  //will limit what elements get listened to at all
                    //    //domElementListen: self.$el,
                    //    domElementListen: $(document),
                    //    //domElementUpdate: $(self.el),
                    //    domElementUpdate: $(document),
                    //
                    //    domEventType: 'keyup',
                    //    propagateChangesToServerImmediately:false,
                    //    callback: null
                    //});

                    //this.listenTo(this.collection, 'change', this.render);
                    //this.listenTo(this.collection, 'add remove reset', this.render);

                },
                render: function () {

                    console.log('ATTEMPTING to render userProfileView.');

                    var self = this;

                    var ret = EJS.render(UserProfileView.template, {
                        user: self.model,
                        model:self.model,
                        collection:self.collection
                    });

                    self.$el.html(ret);
                    console.log('userProfileView (re)-rendered');

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
                template: template
            }
        );

        return UserProfileView;

    });