/**
 * Created by denmanm1 on 6/9/15.
 */


console.log('loading app/js/collections/usersCollection.js');


define(
    [
        'underscore',
        '#allModels',
        '@BaseCollection',
        '@AppDispatcher'
    ],

    function (_, models, BaseCollection, AppDispatcher) {

        var UsersCollection = BaseCollection.extend({

            model: models.User,
            url: '/users',
            batchURL: '/batch/User',


            initialize: function (models, opts) {

                this.dispatchToken = AppDispatcher.register(this.dispatchCallback);

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