/**
 * Created by amills001c on 6/9/15.
 */



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
        }
    });

    var User = Backbone.Model.extend({

        urlRoot: '/users',

        defaults: {
            title: '',
            completed: false
        },

        // Toggle the `completed` state of thistodo item.
        toggle: function () {
            this.save({
                completed: !this.get('completed')
            });
        }
    });

    return {
        TodoModel:Todo,
        UserModel:User
    };
});