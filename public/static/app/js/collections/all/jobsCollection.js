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
        'backbone',
        '#allModels',
        '#BaseCollection',
        '#allDispatchers'

    ],

    function (_, Backbone, models, BaseCollection, allDispatchers) {

        var dispatcher = allDispatchers['app/js/flux/dispatchers/JobsDispatcher'];

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

            initialize: function (models,opts) {

                console.log('model for JobsCollection is:', this.model);

                this.dispatchToken = dispatcher.register(this.dispatchCallback);

                this.givenName = '@JobsCollection';
                this.uniqueName = 'jobs';

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


            //TODO:http://www.toptal.com/front-end/simple-data-flow-in-react-applications-using-flux-and-backbone

            dispatchCallback: function(payload){

                var self = this;

                switch(payload.actionType){

                    case 'delete':
                        self.remove(payload.model)
                        break;
                    case 'add':
                        self.add(payload.model)
                        break;
                    case 'update':
                        self.add(payload.model)
                        break;

                }


            },


            // Todos are sorted by their original insertion order.
            comparator: 'order'
        });



        return new JobsCollection();
    });