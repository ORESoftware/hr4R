/**
 * Created by amills001c on 6/9/15.
 */


console.log('loading app/js/collections/usersCollection.js');


define(
    [
        'underscore',
        'backbone',
        '#allModels',
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

            batchURL: '/batch/User',
            //urlRoot: '/users',


            initialize: function (models, opts) {

                this.uniqueName = 'users';
                this.givenName = '@UsersCollection';

                this.options = opts || {};
                _.bindAll(this, 'persistCollection');

            },

            // Users are sorted by their original insertion order.
            comparator: 'order'
        });


        return new UsersCollection();
    });