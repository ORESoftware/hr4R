/**
 * Created by amills001c on 7/6/15.
 */



console.log('loading allCollections');


define(
    [
        'app/js/collections/usersCollection',
        'app/js/collections/jobsCollection'
    ],

    function (UsersCollection, JobsCollection) {


        return {
            users: UsersCollection,
            jobs: JobsCollection

        };
    });