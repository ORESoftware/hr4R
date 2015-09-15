/**
 * Created by amills001c on 6/11/15.
 */


//var app = app || {};
//TODO: http://cdnjs.com/libraries/backbone.js/tutorials/what-is-a-model

console.log('loading loginView');

define(
    [
        '+appState',
        '#allCollections',
        '#allModels',
        'form2js',
        'ejs',
        'underscore',
        'backbone-validation',
        'ijson',
        '@oplogSocketClient'
    ],


    function (appState, collections, models, form2js, EJS, _, BackboneValidation, IJSON, osc) {


        var LoginView = Backbone.View.extend({

                el: '#child-view-login-container',

                events: {
                    'click #submit-login-button-id': 'onSubmitLogin',
                    'click #submit-registration-button-id': 'onSubmitRegistration',
                    'click #accountRecoveryId': 'showAccountRecoveryView'
                },

                constructor: function () {
                    this.givenName = '@LoginView';
                    Backbone.View.apply(this, arguments);
                },

                initialize: function (opts) {

                    this.setViewProps(opts); //has side effects
                    _.bindAll(this, 'render', 'onSubmitLogin', 'onSubmitRegistration');
                    //this.listenTo(this.collection, 'add remove', this.render);

                    //this.model = new models.UserModel();
                },


                render: function () {


                    var self = this;

                    var allTemplates = require('#allTemplates');
                    var allViews = require('#allViews');

                    var template = allTemplates['templates/loginTemplate.ejs'];

                    var ret = EJS.render(template, {
                        model: self.model,
                        collection: self.collection
                    });

                    self.$el.html(ret);

                    return this;

                },

                onSubmitLogin: function (event) {
                    event.preventDefault();


                    var self = this;

                    var data = form2js('login-form-id', '.', true);

                    console.log('registration data:', data);

                    //var userData = JSON.stringify(data.user);

                    var userData = data.user;

                    //TODO: use socket.io to get server data
                    //TODO: localstorage vs cookies //encrypt user on front-end

                    $.ajax({
                        type: "POST",
                        url: '/login',
                        dataType: "json",
                        data: userData
                    }).done(function (msg) {

                        appState.set('env', msg.env);

                        if (msg.isAuthenticated === true) {

                            var user = msg.user;

                            collections.users.fetch().done(function () {

                                for (var i = 0; i < collections.users.models.length; i++) {

                                    if (user.username === collections.users.models[i].get('username')) {
                                        //appGlobal.currentUser = collections.users.models[i];
                                        appState.set('currentUser', collections.users.models[i]);
                                        break;
                                    }

                                }

                                if (appState.get('currentUser') == null) {
                                    throw new Error('null or undefined currentUser');
                                }
                                else {

                                    if (readFromLocalStorage('use_socket_server')) {
                                        osc.getSocketIOConn();
                                    }
                                    var hash = readFromLocalStorage('original_hash_request');
                                    Backbone.Events.trigger('bootRouter', hash);
                                }

                            }).fail(function (err) {
                                throw err;
                            }).always(function () {

                            });
                        }
                        else {
                            appState.set('currentUser', null);
                            Backbone.Events.trigger('bootRouter', 'index');
                            //TODO:http://stackoverflow.com/questions/19588401/backbone-navigation-callback
                        }


                    })
                        .fail(function (msg) {
                            self.render();
                            setTimeout(function () {
                                //TODO get validator error from mongoose by submitting bad registration info (missing firstname/username etc)
                                alert("Server error during user login/registration - " + IJSON.parse(msg));//
                            }, 200);
                        })
                        .always(function () {
                            //self.render();
                        });


                },

                onSubmitRegistration: function (event) {
                    event.preventDefault();

                    var self = this;
                    var data = form2js('register-form-id', '.', true);
                    var userData = data.user;

                    $.ajax({
                        type: "POST",
                        url: '/register',
                        dataType: "json",
                        data: userData
                    })

                        .done(function (res) {

                            if (res.error) {
                                self.render();
                                setTimeout(function () {
                                    alert("Very Bad login" + IJSON.parse(res.error));
                                }, 200);
                            }
                            else if (res.success) { //TODO: I like this convention
                                res = res.success;
                                goHome(res);
                            }
                            else {
                                throw new Error('Unexpected response from server.');
                            }

                        })
                        .fail(function (msg) {
                            self.render();
                            setTimeout(function () {
                                alert("Server error during user login/registration - " + msg);
                            }, 200);
                        })
                        .always(function () {
                            //self.render();
                        });
                }
            },
            {//class properties
                //template: template
            }
        );


        function goHome(res) {

            if (res.alreadyRegistered) {

                console.log('user is already registered on server, attempting to match the user with collection object...');

                var user = res.user;

                collections.users.fetch()
                    .done(function () {

                        for (var i = 0; i < collections.users.models.length; i++) {

                            if (user.username === collections.users.models[i].get('username') &&
                                user._id == collections.users.models[i].get('_id')
                            ) {
                                appState.set('currentUser', collections.users.models[i]);
                                break;
                            }
                        }

                        if (appState.get('currentUser') == null) {
                            throw new Error('null or undefined currentUser');
                        }
                        else {

                            var hash = readFromLocalStorage('router_hash_request');
                            if (hash == null) {
                                hash = readFromLocalStorage('original_hash_request');
                            }
                            if (readFromLocalStorage('use_socket_server')) {
                                osc.getSocketIOConn();
                            }
                            Backbone.Events.trigger('bootRouter', hash);
                        }

                    })
                    .fail(function (err) {
                        alert('failed to fetch users collection in loginView');
                    });
            }
            else {

                var newUser = models.User.newUser(res.user);
                collections.users.add(newUser);
                appState.set('currentUser', newUser);
                Backbone.syncCollection(collections.users, function (err, res) {  //TODO: should just save UserModel, not whole collection here
                    if (err) {
                        throw err;
                    }
                    else {
                        if (readFromLocalStorage('use_socket_server')) {
                            osc.getSocketIOConn();
                        }
                        Backbone.Events.trigger('bootRouter', 'home');
                    }
                });
            }
        }


        return LoginView;

    });