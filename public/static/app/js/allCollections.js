/**
 * Created by amills001c on 7/6/15.
 */



console.log('loading allCollections');


define(

    [
        'app/js/collections/usersCollection',
        'exports'
    ],

    function (UsersCollection,exports) {


        return {
            users: UsersCollection

        };
    });