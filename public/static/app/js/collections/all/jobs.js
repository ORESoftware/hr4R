/**
 * Created by amills001c on 7/17/15.
 */


/**
 * Created by amills001c on 6/9/15.
 */


console.log('loading app/js/collections/jobsCollection.js');


define(
    [
        'underscore',
        '#allModels',
        '@BaseCollection',
        '@AppDispatcher',
        '#allFluxConstants',
        'app/js/helpers/collectionUpdater'

    ],

    function (_, models, BaseCollection, AppDispatcher, allFluxConstants, collUpdater) {

        var uniqueCollectionName = 'jobs';

        var CollectionConstants = allFluxConstants['CollectionConstants'];
        var OplogClientConstants = allFluxConstants['OplogClientConstants'];

        var dispatchCallback = function (payload) {

            var actionType = payload.actionType;
            var data = payload.data;

            switch (actionType) {

                case (OplogClientConstants.OPLOG_INSERT + uniqueCollectionName):
                    collUpdater.handleInsert(jobsCollection,data);
                    break;

                case (OplogClientConstants.OPLOG_UPDATE + uniqueCollectionName):
                    collUpdater.handleUpdate(jobsCollection,data);
                    break;

                case (OplogClientConstants.OPLOG_REMOVE + uniqueCollectionName):
                    collUpdater.handleRemove(jobsCollection,data);
                    break;

                default:
                    return true;
            }

            return true;
        };


        var JobsCollection = BaseCollection.extend({
            // Reference to this collection's model.
            model: models.Job,

            //url: function () {
            //    //return '/jobs?job_id=' + this.options.job_id;
            //    return '/jobs';
            //},

            url: '/jobs',
            //urlRoot: '/jobs',
            batchURL: '/batch/Job',

            //constructor: function () {
            //    this.givenName = '@JobsCollection';
            //    Backbone.Collection.apply(this, arguments);
            //},

            initialize: function (models, opts) {

                this.dispatchToken = AppDispatcher.register(dispatchCallback);

                this.givenName = '@JobsCollection';
                this.uniqueName = uniqueCollectionName;

                this.options = opts || {};
                _.bindAll(this, 'persistCollection');

            },


            //TODO:http://www.toptal.com/front-end/simple-data-flow-in-react-applications-using-flux-and-backbone


            // Todos are sorted by their original insertion order.
            comparator: 'order'
        });


        var jobsCollection = new JobsCollection();

        return jobsCollection;
    });