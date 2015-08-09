/**
 * Created by amills001c on 6/9/15.
 */


console.log('loading app/js/models/userModel.js');

//TODO: In model, urlRoot is used for the Model. url is used for the instance of the Model.
//TODO: http://beletsky.net/2012/11/baby-steps-to-backbonejs-model.html
//TODO: http://christianalfoni.github.io/javascript/2014/10/22/nailing-that-validation-with-reactjs.html

define(
    [
        'underscore',
        'backbone',
        'ijson',
        'app/js/models/BaseModel',
        'app/js/models/NestedModel',
        'app/js/ModelCollectionMediator'
        //'#allCollections'
    ],

    function (_, Backbone,IJSON, BaseModel, NestedModel, MCM) {

        var User = BaseModel.extend({

                //idAttribute: "_id",

                //url: '/users',
                //urlRoot: '/users?user_id=',
                stale: ['paid'],

                urlRoot: function(){
                    //if(this.collection == null){
                    //    throw new Error('no collection assigned to model');
                    //}
                    //return '/' + this.collection.uniqueName +'/'
                    return '/users'
                },

                //urlRoot: '/users',

                defaults: function () { //prevents copying default attributes to all instances of UserModel
                    return {
                        firstName: null,
                        lastName: null,
                        username: null,
                        password: null,
                        email: null,
                        old_password: null,
                        new_password: null,
                        created_by:null,
                        updated_by:null,
                        created_at:null,
                        updated_at:null,
                        nestedModel: null
                    }
                },

                //constructor: function (attributes,opts) {
                //    this.givenName = '@UserModel';
                //    Backbone.Model.apply(this, arguments);
                //},


                initialize: function (attributes, opts) {

                    this.givenName = '@UserModel';
                    this.options = opts || {};

                    this.set('nestedModel',new NestedModel(this,{}));

                    this.collection = MCM.findCollectionByName('users');

                    _.bindAll(this, 'deleteModel', 'persistModel', 'validate','parse');


                    console.log('UserModel has been intialized');
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

                newUser: function (attributes,options) {
                    return new User(attributes,options);
                }

            });


        return User;
    });