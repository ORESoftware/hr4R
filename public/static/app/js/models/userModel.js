/**
 * Created by amills001c on 6/9/15.
 */


console.log('loading app/js/models/userModel.js');

//TODO: In model, urlRoot is used for the Model. url is used for the instance of the Model.
//TODO: http://beletsky.net/2012/11/baby-steps-to-backbonejs-model.html

define(
    [
        'underscore',
        'backbone'
    ],

    function (_, Backbone) {

        var User = Backbone.Model.extend({


                idAttribute: "_id",

                //url: '/users',
                //urlRoot: '/users?user_id=',

                urlRoot: '/users',

                defaults: function () { //prevents copying default attributes to all instances of UserModel
                    return {
                        firstName: null,
                        lastName: null,
                        username: null,
                        password: null,
                        email: null
                    }
                },

                initialize: function (attributes, opts) {

                    this.options = opts || {};

                    _.bindAll(this, 'deleteModel', 'persist', 'validate');
                    //

                    this.on('change', function () {
                        if (this.hasChanged('_id')) {
                            console.log('uh oh!! _id value for this model has been changed');
                        }
                        if (this.hasChanged('firstName')) {
                            console.log('firstName has been changed - ', this.toJSON());
                        }
                    });

                    this.on('change:username', function (msg) {
                        console.log('username for this model:', this, 'has changed --->', msg);
                    });

                    console.log('UserModel has been intialized');
                },

                constructor: function () {
                    this.givenName = '@UserModel';
                    Backbone.Model.apply(this, arguments);
                },

                validate: function (attr) {
                    //if (attr.ID <= 0) {
                    //    return "Invalid value for ID supplied."
                    //}

                    //TODO:https://github.com/thedersen/backbone.validation

                    return undefined;
                },


                persist: function (adds, callback) {
                    var opts = adds || null;
                    this.save(opts, {
                        //wait:true,
                        dataType: "text",
                        //TODO: is callback is only firing once??
                        success: function (model, response, options) {
                            console.log("The model has been saved to the server");
                            callback(model, response, options);
                        },
                        error: function (model, xhr, options) {
                            console.log("Something went wrong while saving the model");
                            callback(model, xhr, options);
                        }
                    });
                },
                deleteModel: function (callback) {
                    this.destroy({
                        wait: true, //prevents optimistic destroy
                        success: function (model, response, options) {
                            console.log("The model has been destroyed/deleted on/from the server");
                            callback(null, model, response, options);
                        },
                        error: function (model, xhr, options) {
                            console.log("Something went wrong while attempting to delete model");
                            var err = new Error('error destroying model');
                            callback(err, model, xhr, options);
                        }
                    });
                },
                parse: function (resp, options) {
                    /*
                     parse converts a response into the hash of attributes to be set on the model.
                     The default implementation is just to pass the response along.
                     */

                    return resp;
                }

                //validation: {
                //    email: {
                //        required: true,
                //        pattern: 'email',
                //        msg: 'Please enter a valid email'
                //    }
                //}
            },

            { //classProperties

                newUser: function ($user) {

                    $user.url = '/users';

                    //var user = new User($user);

                    var user = new User($user);

                    //user.attributes.firstName = $user.firstName;
                    //user.attributes.lastName = $user.lastName;
                    //user.attributes.username = $user.username;
                    //user.attributes.password = $user.password;
                    //user.attributes.email = $user.email;

                    return user;

                }

            });


        return User;
    });