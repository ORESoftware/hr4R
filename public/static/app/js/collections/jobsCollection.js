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
        'app/js/allModels',
        'async'

    ],

    function (_, Backbone, models, async) {

        var JobsCollection = Backbone.Collection.extend({
            // Reference to this collection's model.
            model: models.Job,

            //url: function () {
            //    //return '/jobs?job_id=' + this.options.job_id;
            //    return '/jobs';
            //},

            url: '/jobs',

            batchURL: '/jobs_batch',
            //urlRoot: '/jobs',

            constructor: function () {
                this.givenName = '@JobsCollection';
                Backbone.Collection.apply(this, arguments);
            },


            initialize: function (models,opts) {

                console.log('model for JobsCollection is:', this.model);

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
                // This will be called when an item is updated
                this.on('change', function (model) {
                    console.log('something got changed');
                });
            },

            parse: function(resp) {
                if(resp.success){
                    return resp.success;
                }
                else if(resp.error){
                    return this.models;
                }
                else{
                    return resp;
                }
            },

            persistCollection: function (opts,cb) {

                //TODO: use opts to set same value for all models

                var saveArray = [];

                this.each(function (job, index) {  //iterate through models, add/push function to async.parallel
                    saveArray.push(
                        function (callback) {

                            job.persistModel(null, null, function (err, val) {
                                callback(err);
                            });
                        }
                    )

                });

                async.parallel(saveArray, function (err, results) {
                    cb(err, results);
                });

            },

            // Todos are sorted by their original insertion order.
            comparator: 'order'
        });



        return new JobsCollection();
    });