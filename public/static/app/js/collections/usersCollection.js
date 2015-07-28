/**
 * Created by amills001c on 6/9/15.
 */


console.log('loading app/js/collections/usersCollection.js');


define(
    [
        'underscore',
        'backbone',
        'app/js/allModels',
        'app/js/collections/BaseCollection'
    ],

    function (_, Backbone, models, BaseCollection) {

        var UsersCollection = BaseCollection.extend({

            model: models.User,

            //url: function () {
            //    //return '/users?user_id=' + this.options.user_id;
            //    return '/users';
            //},

            url: '/users',

            batchURL: '/users_batch',
            //urlRoot: '/users',

            //constructor: function () {
            //    this.givenName = '@UsersCollection';
            //    this.__super__.constructor_shoe();
            //    Backbone.Collection.apply(this, arguments);
            //},

            initialize: function (models, opts) {

                this.uniqueName = 'users';

                this.options = opts || {};
                _.bindAll(this, 'persistCollection');

                // This will be called when an item is added. pushed or unshifted
                this.on('add', function (model) {
                    console.log('something got added');
                });
                // This will be called when an item is removed, popped or shifted
                this.on('remove', function (model) {
                    console.log('something got removed');
                });


            },

            // Todos are sorted by their original insertion order.
            comparator: 'order'
        });


        return new UsersCollection();
    });