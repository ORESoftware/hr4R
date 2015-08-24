/**
 * Created by amills001c on 7/23/15.
 */


/**
 * Created by amills001c on 7/17/15.
 */


/**
 * Created by amills001c on 6/9/15.
 */


console.log('loading app/js/models/BaseModel.js');


//TODO: In model, urlRoot is used for the Model. url is used for the instance of the Model.
//TODO: http://beletsky.net/2012/11/baby-steps-to-backbonejs-model.html
//TODO: http://christianalfoni.github.io/javascript/2014/10/22/nailing-that-validation-with-reactjs.html
//TODO: http://www.crittercism.com/blog/nested-attributes-in-backbone-js-models

define(
    [
        '#appState',
        'underscore',
        'backbone',
        'ijson'
    ],

    function (appState, _, Backbone, IJSON) {

        var BaseModel = Backbone.Model.extend({

                idAttribute: '_id',

                needsPersisting: true,

                stale: [], //stale attributes

                /*

                 jashkenas commented on Sep 14, 2011
                 Yes, the collection property exists so that a model knows where to send it's .save() and .fetch() calls.
                 Feel free to add a model to multiple collections, and override the url() function,
                 so that saves still happen properly.

                 */

                //urlRoot: function(){
                //    if(this.collection == null){
                //        throw new Error('no collection assigned to model');
                //    }
                //    return '/' + this.collection.uniqueName +'/'
                //},

                //url: function(){
                //    if(this.collection == null){
                //        throw new Error('no collection assigned to model');
                //    }
                //  return this.collection.uniqueName +'/'
                //},

                constructor: function (attributes, opts) {

                    var self = this;
                    var options = opts || {};

                    if(options.needsPersisting === true){
                        self.needsPersisting = true;
                    }

                    this.collection = options.collection;
                    this.collectionName = options.collectionName;

                    this.on('model-local-change-broadcast', function (model, something) { //TODO: only set needsPersisting on localChange
                        self.needsPersisting = true;
                    });
                    this.on('change', function (model, something) {
                        self.needsPersisting = true; //TODO: model does not need persisting on every change event...
                    });
                    this.on('sync', function () {
                        //self.needsPersisting = false;
                        //TODO: 'sync' event is triggered on a fetch so we need to set needsPersisting to false on a different event
                    });

                    Backbone.Model.apply(this, arguments);

                    //if(this.collection == null && this.collectionName){
                    //    require(['#allCollections'],function(allCollections){
                    //        self.collection = allCollections[this.collectionName];
                    //        Backbone.Model.apply(this, arguments);
                    //    });
                    //}
                    //else{
                    //    Backbone.Model.apply(this, arguments);
                    //}
                },

                //set: function(key, value, options) { //this is also known as (attributes,options)
                //
                //    if(options && options.localChange){
                //       this.trigger('model-local-change-broadcast',this);
                //    }
                //
                //    return Backbone.Model.prototype.set.apply(this, arguments);
                //},

                //    Backbone.Model.prototype.toJSON = function () {
                //    var json = _.clone(this.attributes);
                //    for (var attr in json) {
                //        if ((json[attr] instanceof Backbone.Model) || (json[attr] instanceof Backbone.Collection)) {
                //            json[attr] = json[attr].toJSON();
                //        }
                //    }
                //    return json;
                //};

                newInstance: function(attributes,options){
                       var Constr = this.constructor;
                       var model = new Constr(attributes,options);
                       model.needsPersisting = true;
                       return model;
                },

                parse: function (resp, options) {
                    /*
                     parse converts a response into the hash of attributes to be set on the model.
                     The default implementation is just to pass the response along.
                     */
                    if (resp.success) {
                        //TODO: response.success vs response.error...needsPersisting will depend on that
                        return resp.success;
                    }
                    else if (resp.error) {
                        return this.attributes;
                    }
                    else {
                        //this will get called when collection parses stuff
                        return resp;
                    }
                },

                toJSON: function () {
                    // return _.omit(this.attributes, this.stale);
                    var json = _.clone(_.omit(this.attributes, this.stale));
                    for (var attr in json) {
                        if ((json[attr] instanceof Backbone.Model) || (json[attr] instanceof Backbone.Collection)) {
                            json[attr] = json[attr].toJSON();
                        }
                    }
                    return json;
                },

                setNestedAttrForChange: function (parentAttribute, nestedAttributeString, newValue, opts) {

                    var clonedValue = _.clone(this.get(parentAttribute));
                    eval('clonedValue.' + nestedAttributeString + '= newValue;');
                    this.set(parentAttribute, clonedValue, opts);

                },

                set: function (key, val, options) {
                    if (key == null) return this;

                    // Handle both `"key", value` and `{key: value}` -style arguments.
                    var attrs;
                    if (typeof key === 'object') {
                        attrs = key;
                        options = val;
                    }
                    else {
                        (attrs = {})[key] = val;
                    }

                    options || (options = {});

                    // Run validation.
                    if (!this._validate(attrs, options)) return false;

                    // Extract attributes and options.
                    var unset = options.unset;
                    var silent = options.silent;
                    var changes = [];
                    var changing = this._changing;
                    this._changing = true;

                    if (!changing) {
                        this._previousAttributes = _.clone(this.attributes);
                        this.changed = {};
                    }

                    var current = this.attributes;
                    var changed = this.changed;
                    var prev = this._previousAttributes;

                    // For each `set` attribute, update or delete the current value.
                    for (var attr in attrs) {
                        val = attrs[attr];
                        if (!_.isEqual(current[attr], val)) changes.push(attr);
                        if (!_.isEqual(prev[attr], val)) {
                            changed[attr] = val;
                        }
                        else {
                            delete changed[attr];
                        }
                        unset ? delete current[attr] : current[attr] = val;
                    }

                    // Update the `id`.
                    this.id = this.get(this.idAttribute);

                    // Trigger all relevant attribute changes.
                    if (!silent) {
                        if (changes.length) this._pending = options;
                        for (var i = 0; i < changes.length; i++) {
                            this.trigger('change:' + changes[i], this, current[changes[i]], options);
                        }
                    }

                    // You might be wondering why there's a `while` loop here. Changes can
                    // be recursively nested within `"change"` events.
                    if (changing) return this;

                    //TODO: I added this:
                    if (options && options.localChange) {
                        this.trigger('model-local-change-broadcast', this);
                    }

                    //TODO: I added this:
                    if (options && options.socketChange) {
                        this.trigger('model-socket-change-broadcast', this);
                    }

                    if (!silent) {
                        while (this._pending) {
                            options = this._pending;
                            this._pending = false;
                            this.trigger('change', this, options);
                        }
                    }
                    this._pending = false;
                    this._changing = false;
                    return this;
                }

                ,

                persistModel: function (attributes, opts, callback) {

                    //TODO: need to take into account new attributes here insofar as needs persisting goes

                    var options = opts || {};

                    if (this.needsPersisting || attributes != null || options.forceSave === true) {

                        //this.attributes = _.extend({},attributes,this.attributes);

                        //TODO: add opts to object below
                        //TODO: need to make this work for new user that logs in

                        if (this.get('_id') == null && appState.get('currentUser')) {
                            this.set('created_at', Date.now());
                            var created_by = appState.get('currentUser').get('_id').concat('@').concat(Date.now());
                            this.set('created_by', created_by);
                        }

                        if (appState.get('currentUser')) {
                            var updated_by = appState.get('currentUser').get('_id').concat('@').concat(Date.now());
                            this.set('updated_by', updated_by);
                        }

                        this.set('updated_at', Date.now());

                        var self = this;
                        this.save(attributes, {
                            wait: true, //TODO: prevents optimistic persist (?)
                            dataType: "json",
                            success: function (model, response, options) {
                                //TODO: response.success vs response.error...needsPersisting will depend on that
                                self.needsPersisting = false;
                                if (typeof callback === 'function') {
                                    callback(null, model, IJSON.parse(response), options);
                                }
                                else { //TODO: remove this else
                                    //throw new Error('no callback passed to persistModel function');
                                }
                            },
                            error: function (model, xhr, options) {
                                self.needsPersisting = false; //TODO: don't want to keep trying an error?
                                var err = new Error("Something went wrong while saving the model");
                                if (typeof callback === 'function') {
                                    callback(err, model, xhr, options);
                                }
                                else {
                                    throw err;
                                }
                            }
                        });
                    }
                    else {
                        console.log('avoided unnecessarily saving model to server:', this);
                        if (typeof callback === 'function') {
                            callback(null, this, null, null);
                        }
                    }

                },

                deleteModel: function (opts, callback) {
                    //TODO: add opts to object below
                    //TODO: turn this into https://www.dropbox.com/s/lzzgg2wanjlguf5/Screenshot%202015-07-14%2016.54.57.png?dl=0
                    this.destroy({
                        wait: true, //prevents optimistic destroy
                        dataType: "json",
                        success: function (model, response, options) {
                            console.log("The model has been destroyed/deleted on/from the server");
                            self.needsPersisting = false;
                            callback(null, model, response, options);
                        },
                        error: function (model, xhr, options) {
                            console.log("Something went wrong while attempting to delete model");
                            var err = new Error('error destroying model');
                            callback(err, model, xhr, options);
                        }
                    });
                }


            },

            { //class properties

            });


        return BaseModel;
    })
;