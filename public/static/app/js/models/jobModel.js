/**
 * Created by amills001c on 7/17/15.
 */


/**
 * Created by amills001c on 6/9/15.
 */


console.log('loading app/js/models/jobModel.js');

//TODO: In model, urlRoot is used for the Model. url is used for the instance of the Model.
//TODO: http://beletsky.net/2012/11/baby-steps-to-backbonejs-model.html
//TODO: http://christianalfoni.github.io/javascript/2014/10/22/nailing-that-validation-with-reactjs.html

define(
    [
        'underscore',
        'backbone',
        'ijson'
    ],

    function (_, Backbone,IJSON) {

        var Job = Backbone.Model.extend({


                idAttribute: "_id",

                //url: '/jobs',
                //urlRoot: '/jobs?job_id=',

                urlRoot: '/jobs',

                defaults: function () { //prevents copying default attributes to all instances of JobModel
                    return {
                        jobname: null,
                    }
                },

                constructor: function (attributes,opts) {
                    this.givenName = '@JobModel';
                    Backbone.Model.apply(this, arguments);
                },


                initialize: function (attributes, opts) {

                    this.options = opts || {};

                    _.bindAll(this, 'deleteModel', 'persistModel', 'validate','parse');
                    //

                    this.on('change', function () {
                        if (this.hasChanged('_id')) {
                            console.log('uh oh!! _id value for this model has been changed');
                        }
                        if (this.hasChanged('firstName')) {
                            console.log('firstName has been changed - ', this.toJSON());
                        }
                    });

                    this.on('change:jobname', function (msg) {
                        console.log('jobname for this model:', this, 'has changed --->', msg);
                    });

                    console.log('JobModel has been intialized');
                },


                validate: function (attr) {
                    //if (attr.ID <= 0) {
                    //    return "Invalid value for ID supplied."
                    //}

                    //TODO:https://github.com/thedersen/backbone.validation

                    return undefined;
                },


                persistModel: function (attributes, opts, callback) {
                    //TODO: add opts to object below
                    this.save(attributes, {
                        wait: true, //prevents optimistic destroy
                        dataType: "json",
                        //TODO:  model.trigger('sync', model, resp, options);
                        success: function (model, response, options) {
                            console.log("The model has been saved to the server");
                            callback(null,model, IJSON.parse(response), options);
                        },
                        error: function (model, xhr, options) {
                            var err = new Error("Something went wrong while saving the model");
                            callback(err, model, xhr, options);
                        }
                    });
                },
                deleteModel: function (opts,callback) {
                    //TODO: add opts to object below
                    //TODO: turn this into https://www.dropbox.com/s/lzzgg2wanjlguf5/Screenshot%202015-07-14%2016.54.57.png?dl=0
                    this.destroy({
                        wait: true, //prevents optimistic destroy
                        dataType: "json",
                        success: function (model, response, options) {
                            console.log("The model has been destroyed/deleted on/from the server");
                            callback(null, model, response, options);
                        },
                        error: function (model, xhr, options) {
                            console.log("Something went wrong while attempting to delete model");
                            var err = new Error('error destroying model');
                            callback(err, model, xhr, options);
                        }
                    });
                },
                parse: function (resp, options) {
                    /*
                     parse converts a response into the hash of attributes to be set on the model.
                     The default implementation is just to pass the response along.
                     */
                    if(resp.success){
                        return resp.success;
                    }
                    else if(resp.error){
                        return this.attributes;
                    }
                    else{
                        return resp;
                    }
                    //return resp;
                }

                //validation: {
                //    email: {
                //        required: true,
                //        pattern: 'email',
                //        msg: 'Please enter a valid email'
                //    }
                //}
            },

            { //class properties

                newJob: function ($job) {

                    var job = new Job($job);
                    return job;
                }
            });


        return Job;
    });