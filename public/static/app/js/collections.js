/**
 * Created by amills001c on 6/9/15.
 */


console.log('loading app/js/COLLECTIONS.js');


define('app/js/collections',

    [
        'underscore',
        'backbone',
        'app/js/models'

    ],

    function (_, Backbone, models) {
        'use strict';

        var UsersCollection = Backbone.Collection.extend({
            // Reference to this collection's model.
            model: models.UserModel,

            initialize: function () {

                //this.fetch({
                //    success: this.fetchSuccess,
                //    error: this.fetchError
                //});

                console.log('model for UsersCollection is:', this.model);

                // This will be called when an item is added. pushed or unshifted
                this.on('add', function (model) {
                    console.log('something got added');
                });
                // This will be called when an item is removed, popped or shifted
                this.on('remove', function (model) {
                    console.log('something got removed');
                });
                // This will be called when an item is updated
                this.on('change', function (model) {
                    console.log('something got changed');
                });
            },

            url: function () {
                //return '/users?user_id=' + this.options.user_id;
                return '/users';
            },

            // Todos are sorted by their original insertion order.
            comparator: 'order'
        });

        return {
            users: new UsersCollection()
        };
    });