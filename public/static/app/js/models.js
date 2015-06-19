/**
 * Created by amills001c on 6/9/15.
 */


console.log('loading app/js/MODELS.js');

define(['underscore', 'backbone'], function (_, Backbone) {

    'use strict';

    var Todo = Backbone.Model.extend({

        urlRoot: '/todos',

        defaults: {
            title: '',
            completed: false
        },

        // Toggle the `completed` state of thistodo item.
        toggle: function () {
            this.save({
                completed: !this.get('completed')
            });
        },
        validate: function (attr) {
            if (attr.ID <= 0) {
                return "Invalid value for ID supplied."
            }
        }
    });

    var User = Backbone.Model.extend({


        idAttribute: "mongo_ID",

        urlRoot: '/users?user_id=',

        defaults: {
            firstName: null,
            lastName: null,
            username: null,
            password: null
        },

        initialize: function(){
            console.log('User has been intialized');


            this.on('change',  function() {
                if(this.hasChanged('ID')){
                    console.log('ID has been changed');
                }
                if(this.hasChanged('BookName')){
                    console.log('BookName has been changed');
                }
            });
        },

        constructor: function (attributes, options) {
            Backbone.Model.apply(this, arguments);
        },

        validate: function (attr) {
            //if (attr.ID <= 0) {
            //    return "Invalid value for ID supplied."
            //}

            return true;
        },

        persist: function(callback){
            this.save({}, {
                success: function (model, response, options) {
                    console.log("The model has been saved to the server");
                    callback(model,response,options);
                },
                error: function (model, xhr, options) {
                    console.log("Something went wrong while saving the model");
                    callback(model,response,options);
                }
            });
        }
    });

    return {
        TodoModel:Todo,
        UserModel:User
    };
});