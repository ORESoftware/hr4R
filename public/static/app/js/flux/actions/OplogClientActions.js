/**
 * Created by amills001c on 9/10/15.
 */


define(
    [
        '@AppDispatcher',
        '#allFluxConstants'
    ],
    function (AppDispatcher, allFluxConstants) {

        var Constants = allFluxConstants['OplogClientConstants'];


        var OplogClientActions = {

            insert: function (collectionName, data) {
                AppDispatcher.dispatch({
                    //AppDispatcher.handleAction({
                    actionType: Constants.OPLOG_INSERT + collectionName,
                    data: data
                });
            },

            update: function (collectionName, data) {
                AppDispatcher.dispatch({
                    actionType: Constants.OPLOG_UPDATE + collectionName,
                    data: data
                });
            },

            remove: function (collectionName, data) {
                AppDispatcher.dispatch({
                    actionType: Constants.OPLOG_REMOVE + collectionName,
                    data: data
                });
            }
        };


        return OplogClientActions;

    });