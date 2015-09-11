/**
 * Created by amills001c on 9/10/15.
 */


//TODO: https://blog.risingstack.com/the-react-js-way-flux-architecture-with-immutable-js/

define(function () {


    function handleFetchOptimized(collection, cb) {

        collection.fetchOptimized(function (err) {
            if (err) {
                cb(err);
            }
            else {
               cb(null)
            }
        });
    }


    return {}


});