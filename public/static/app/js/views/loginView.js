/**
 * Created by amills001c on 6/11/15.
 */


//var app = app || {};
//TODO: http://cdnjs.com/libraries/backbone.js/tutorials/what-is-a-model

console.log('loading loginView');

define(['app/js/routers', 'app/js/collections', 'app/js/models', 'form2js', 'ejs', 'jquery', 'underscore', 'handlebars', 'backbone', 'backbone-validation'],


    function (routers, collections, models, form2js, EJS, $, _, Handlebars, Backbone, BackboneValidation) {

        var router = routers(null).bootRouter;

        var LoginView = Backbone.View.extend({

            model: null,
            collection: null,

            el: '#child-view-login-container',

            initialize: function () {
                _.bindAll(this, "render");
                //this.collection.bind("reset", this.render);
                this.model = new models.UserModel();
            },

            events: {
                'click #submit-login-button-id': 'onSubmitLogin',
                'click #submit-registration-button-id': 'onSubmitRegistration',
                'click #accountRecoveryId': 'showAccountRecoveryView'
            },


            render: function () {

                console.log('attempting to render LoginView.');

                var self = this;


                $.ajax({
                    url: 'static/html/ejs/loginTemplate.ejs',
                    type: 'GET',
                    success: function (msg) {
                        var ret = EJS.render(msg, {});
                        //console.log('login view:', ret);
                        self.$el.html(ret);
                        console.log('IndexView rendered');
                    },
                    error: function (err) {
                        console.log('error:', err);
                    }
                });

                return this;
            },

            onSubmitLogin: function (event) {
                event.preventDefault();


                var self = this;

                var data = form2js('login-form-id', '.', true);

                console.log('registration data:', data);

                //var userData = JSON.stringify(data.user);

                var userData = data.user;

                //TODO: userdata is not in json format or what??
                //TODO: use socket.io to get server data
                //TODO: localstorage vs cookies

                $.ajax({
                    type: "POST",
                    url: '/login',
                    dataType: "json",
                    data: userData
                }).done(function (msg) {
                    console.log('authentication message:', msg);

                    appGlobal.authorized = msg.isAuthenticated;
                    //appGlobal.currentUser = msg.user;  //TODO: might need to find currentUser in users collection first
                    var user = msg.user
                    appGlobal.env = msg.env;

                    if (appGlobal.authorized === true) {

                        collections.users.fetch().done(function () {

                            for (var i = 0; i < collections.users.models.length; i++) {

                                if (user.username === collections.users.models[i].username) {
                                    appGlobal.currentUser = collections.users.models[i];
                                    break;
                                }

                            }

                            if (appGlobal.currentUser === null) {
                                throw new Error('null appGlobal.currentUser');
                            }
                            //window.location.hash='home';
                            console.log('user logged in successfully!!');
                            router.navigate('home', {trigger: true});
                        });
                    }
                    else {
                        //window.location.hash='login';
                        console.log('user did not log in successfully..!');

                        alert('bad login');
                        router.navigate('index', {trigger: true});
                    }


                })
                    .fail(function () {
                        setTimeout(function () {
                            alert("Server error during user login/registration.");
                        }, 200);
                        self.render();
                    })
                    .always(function () {

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
                }).done(function (response) {
                    if (response.user == null) {
                        setTimeout(function () {
                            alert("Bad login");
                        }, 200);
                        self.render();
                        return;
                    }

                    var newUser = models.UserModel.newUser(response.user);

                    var userColl = collections.users;

                    userColl.add(newUser);

                    Backbone.sync(userColl);

                    appGlobal.currentUser = newUser;
                    //var url = response;
                    //$(location).attr('href', url);
                    router.navigate('home', {trigger: true});
                })
                    .fail(function () {
                        setTimeout(function () {
                            alert("Server error during user login/registration.");
                        }, 200);
                        self.render();
                    })
                    .always(function () {

                    });
            }


        });

        return LoginView;

    });