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

//http://stackoverflow.com/questions/6351271/backbone-js-get-and-set-nested-object-attribute

define(
    [
        '../../../../../../bower_components/underscore/underscore',
        'backbone',
        'ijson',
        'app/js/models/BaseModel',
        'app/js/ModelCollectionMediator'
        //'#allCollections'
    ],

    function (_, Backbone, IJSON, BaseModel,MCM) {

        var Job = BaseModel.extend({


                //idAttribute: "_id",

                //url: '/jobs',
                //urlRoot: '/jobs?job_id=',

                //urlRoot: '/jobs',

                urlRoot: function () {
                    //if(this.collection == null){
                    //    throw new Error('no collection assigned to model');
                    //}
                    //return '/' + this.collection.uniqueName +'/'
                    return '/jobs'
                },

                defaults: function () { //prevents copying default attributes to all instances of JobModel
                    return {
                        jobName: null,
                        firstName: null,
                        lastName: null,
                        //animals: new NestedModel(this, {
                        //    cats: true,
                        //    dogs: false,
                        //    birds: false
                        //}),
                        animals: {
                            cats: true,
                            dogs: false,
                            birds: false
                        },
                        isVerified: true
                    }
                },

                //constructor: function (attributes, opts) {
                //    this.givenName = '@JobModel';
                //    Backbone.Model.apply(this, arguments);
                //},


                initialize: function (attributes, opts) {

                    this.options = opts || {};
                    this.givenName = '@JobModel';

                    //TODO: how to have a default collection?

                    if (this.collection == null) {
                        if (this.collectionName) {
                            this.collection = MCM.findCollectionByName(this.collectionName);
                        }
                        else { //default
                            this.collection = MCM.findCollectionByName('jobs');
                        }
                    }

                    _.bindAll(this, 'deleteModel', 'persistModel', 'validate', 'parse');
                    console.log('JobModel has been intialized');
                },


                validate: function (attr) {
                    //if (attr.ID <= 0) {
                    //    return "Invalid value for ID supplied."
                    //}

                    //TODO:https://github.com/thedersen/backbone.validation

                    return undefined;
                }

            },

            { //class properties

                newJob: function (attributes, options) {
                    return new Job(attributes, options);
                }
            });


        return Job;
    });