/**
 * Created by amills001c on 6/11/15.
 */



define(['app/js/collections', 'app/js/models', 'form2js','ejs', 'jquery', 'underscore', 'handlebars', 'backbone', 'backbone-validation'],


    function (collections, models, form2js, EJS, $, _, Handlebars, Backbone, BackboneValidation) {


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


            },

            onSubmitRegistration: function (event) {
                event.preventDefault();


                var self = this;

                var data = form2js('register-form-id','.',true);

                console.log('registration data:',data);

                $.ajax({
                    type:"POST",
                    url: '/register',
                    //dataType: "json",
                    data: data})

                    .done(function(response) {
                        if(response == 'bad login'){
                            window.mainLoginView.render();
                            alert("bad login");
                            return;
                        }
                        var url = response;
                        $(location).attr('href',url);
                    })
                    .fail(function() {
                        alert("error registering");
                        self.render();
                    })
                    .always(function() {

                    });
            }


        });

        return LoginView;

    });