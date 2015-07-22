/**
 * Created by amills001c on 7/6/15.
 */



console.log('loading allCollections');


define(
    [
        'app/js/collections/usersCollection',
        'app/js/collections/jobsCollection',
        'exports'
    ],

    function (UsersCollection, JobsCollection, exports) {


        return {
            users: UsersCollection,
            jobs: JobsCollection

        };
    });