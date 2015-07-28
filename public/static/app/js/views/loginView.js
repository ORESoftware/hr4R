/**
 * Created by amills001c on 6/11/15.
 */


//var app = app || {};
//TODO: http://cdnjs.com/libraries/backbone.js/tutorials/what-is-a-model

console.log('loading loginView');

define(
    [
        '#appState',
        'app/js/allCollections',
        'app/js/allModels',
        'form2js',
        'ejs',
        'jquery',
        'underscore',
        'backbone',
        'backbone-validation',
        'ijson',
        'app/js/giant',
        'text!app/templates/loginTemplate.ejs'
    ],


    function (appState, collections, models, form2js, EJS, $, _, Backbone, BackboneValidation, IJSON, giant, template) {

        //var router = routers(null).bootRouter;

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
                    this.listenTo(this.collection, 'add remove', this.render);

                    //this.model = new models.UserModel();
                },


                render: function () {

                    console.log('attempting to render LoginView.');

                    var self = this;

                    if (LoginView.template == null) {

                        console.log('loginView template is null, retrieving from server.')

                        $.ajax({
                            url: 'static/html/ejs/loginTemplate.ejs',
                            type: 'GET',
                            success: function (msg) {
                                LoginView.template = msg;
                                renderThis.bind(self)(LoginView.template);
                            },
                            error: function (err) {
                                console.log('error:', err);
                            }
                        });
                    }
                    else {

                        renderThis.bind(self)(LoginView.template);
                    }

                    function renderThis($template) {
                        var ret = EJS.render($template, {});
                        self.$el.html(ret);
                        console.log('loginView rendered');
                    }


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
                                    console.log('user logged in successfully!!');
                                    //Backbone.Events.trigger('bootRouter', 'home');
                                    var hash = readFromLocalStorage('original_hash_request');
                                    createSocketConnection();
                                    Backbone.Events.trigger('bootRouter', hash);
                                }

                            }).fail(function (err) {
                                throw err;
                            }).always(function () {

                            });
                        }
                        else {
                            appState.set('currentUser', null);
                            console.log('user did not log in successfully..!');
                            Backbone.Events.trigger('bootRouter', 'index');
                            //TODO:http://stackoverflow.com/questions/19588401/backbone-navigation-callback
                        }


                    })
                        .fail(function (msg) {
                            setTimeout(function () {
                                //TODO get validator error from mongoose by submitting bad registration info (missing firstname/username etc)
                                alert("Server error during user login/registration - " + IJSON.parse(msg));//
                            }, 200);
                        })
                        .always(function () {
                            self.render();
                        });


                },

                onSubmitRegistration: function (event) {
                    event.preventDefault();


                    var self = this;

                    var data = form2js('register-form-id', '.', true);

                    console.log('registration data:', data);

                    //var userData = JSON.stringify(data.user);

                    var userData = data.user;

                    //TODO: userdata is not in json format or what??
                    //TODO: use socket.io to get server data
                    //TODO: localstorage vs cookies

                    $.ajax({
                        type: "POST",
                        url: '/register',
                        dataType: "json",
                        data: userData
                    })

                        .done(function (res) {

                            if (res.error) {
                                setTimeout(function () {
                                    alert("Very Bad login" + IJSON.parse(res.error));
                                }, 200);
                                self.render();
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
                            setTimeout(function () {
                                alert("Server error during user login/registration - " + msg);
                            }, 200);
                        })
                        .always(function () {
                            self.render();
                        });
                }
            },
            {//class properties
                template: template
            }
        );

        function createSocketConnection() {

            giant.getSocketIOConn();

        }

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
                            //Backbone.Events.trigger('bootRouter', 'home');
                            var hash = readFromLocalStorage('router_hash_request');
                            if (hash == null) {
                                hash = readFromLocalStorage('original_hash_request');
                            }
                            createSocketConnection();
                            Backbone.Events.trigger('bootRouter', hash);
                        }

                    }).fail(function (err) {
                        alert('failed to fetch users collection in loginView');
                    });
            }
            else {

                var newUser = models.User.newUser(res.user);
                collections.users.add(newUser);
                Backbone.syncCollection(collections.users, function (err, res) {  //TODO: should just save UserModel, not whole collection here
                    if (err) {
                        throw err;
                    }
                    else {
                        appState.set('currentUser', newUser);
                        createSocketConnection();
                        Backbone.Events.trigger('bootRouter', 'home');
                    }
                });
            }
        }


        return LoginView;

    });