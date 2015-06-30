/**
 * Created by amills001c on 6/9/15.
 */


console.log('loading app/js/MODELS.js');

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

        defaults: {
            firstName: null,
            lastName: null,
            username: null,
            password: null,
            email: null
        },

        initialize: function(options){

            this.options = options || {};

            _.bindAll(this,'validate');



            this.on('change',  function() {
                if(this.hasChanged('_id')){
                    console.log('uh oh!! _id value for this model has been changed');
                }
                if(this.hasChanged('firstName')){
                    console.log('firstName has been changed - ', this.toJSON());
                }
            });

            this.on('change:username',function(msg){
                console.log('username for this model:',this,'has changed --->',msg);
            });

            console.log('UserModel has been intialized');
        },

        constructor: function (attributes, options) {
            Backbone.Model.apply(this, arguments);
        },

        validate: function (attr) {
            //if (attr.ID <= 0) {
            //    return "Invalid value for ID supplied."
            //}

           //TODO:https://github.com/thedersen/backbone.validation

            return undefined;
        },


        persist: function(adds,callback){
            var opts = adds || null;
            this.save(opts, {
                //wait:true,
                dataType:"text",
                //TODO: is callback is only firing once??
                success: function (model, response, options) {
                    console.log("The model has been saved to the server");
                    callback(model,response,options);
                },
                error: function (model, xhr, options) {
                    console.log("Something went wrong while saving the model");
                    callback(model,xhr,options);
                }
            });
        }
        //validation: {
        //    email: {
        //        required: true,
        //        pattern: 'email',
        //        msg: 'Please enter a valid email'
        //    }
        //}
    });


    User.newUser = function($user){

        var user = new User({url:'/users'});

        user.firstName = $user.firstName;
        user.lastName = $user.lastName;
        user.username = $user.username;
        user.password = $user.password;
        user.email = $user.email;

        return user;

    };

    return {
        UserModel:User
    };
});