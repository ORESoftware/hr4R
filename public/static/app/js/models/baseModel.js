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
        '+appState',
        'underscore',
        '@AppDispatcher'
    ],

    function (appState, _) {

        var methodMap = {
            'create': 'POST',
            'update': 'PUT',
            'patch': 'PATCH',
            'delete': 'DELETE',
            'read': 'GET'
        };

        var urlError = function () {
            throw new Error('A "url" property or function must be specified');
        };


        var BaseModel = Backbone.Model.extend({

                idAttribute: '_id',

                needsPersisting: false,

                stale: [], //stale attributes

                noSave: false, //if noSave is true, this model should never be saved to server


                url: function () {
                    var base =
                        _.result(this, 'urlRoot') ||
                        _.result(this.collection, 'url') ||
                        urlError();
                    if (this.isNew()) return base;
                    var id = this.get(this.idAttribute);
                    return base.replace(/[^\/]$/, '$&/') + encodeURIComponent(id);
                },

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

                constructor: function (attributes, options) {

                    var self = this;
                    var opts = options || {};

                    if (opts.needsPersisting === true) {
                        self.needsPersisting = true;
                    }

                    this.collection = opts.collection;
                    this.collectionName = opts.collectionName;

                    this.on('model-local-change-broadcast', function (model, something) { //TODO: only set needsPersisting on localChange
                        self.needsPersisting = true;
                    });

                    this.on('model-socket-change-broadcast', function (model, something) { //TODO: only set needsPersisting on localChange

                    });

                    this.on('change', function (model, something) {
                        //self.needsPersisting = true; //TODO: model does not need persisting on every change event...
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

                dispatchCallback: function(payload){

                    var self = this;

                    switch(payload.actionType){

                        case 'delete':
                            self.remove(payload.model);
                            break;
                        case 'add':
                            self.add(payload.model);
                            break;
                        case 'update':
                            self.add(payload.model);
                            break;
                        default:
                            return true;


                    }

                    return true;
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

                //newInstance: function(attributes,options){
                //       var Constr = this.constructor;
                //       var model = new Constr(attributes,options);
                //       model.needsPersisting = true;
                //       return model;
                //},

                parse: function (resp, options) {
                    /*
                     parse converts a response into the hash of attributes to be set on the model.
                     The default implementation is just to pass the response along.
                     */
                    if (resp.success) {
                        //TODO: response.success vs response.error...parse is called on both fetch and save so needsPersisting needs to depend on something else
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

                },

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

                    this.needsPersisting = false;

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

                methodToURL: {
                    'read': '/user/get',
                    'create': '/user/create',
                    'update': '/user/update',
                    'delete': '/user/remove'
                },

                sync_example1: function(method, model, options) {
                    options = options || {};
                    options.url = model.methodToURL[method.toLowerCase()];

                    return Backbone.sync.apply(this, arguments);
                },

                sync_example2: function (method, model, options) {
                    if (method === 'read') {
                        if (window.localStorage.getItem('myData')) {
                            return window.localStorage.getItem('myData');
                        } else {
                            return Backbone.sync.apply(this, arguments);
                        }
                    } else {
                        return Backbone.sync.apply(this, arguments);
                    }
                },

                sync: function (method, model, options) {

                    //TODO: update this for Backbone.localStorage?

                    var type = methodMap[method];

                    // Default options, unless specified.
                    _.defaults(options || (options = {}), {
                        emulateHTTP: Backbone.emulateHTTP,
                        emulateJSON: Backbone.emulateJSON
                    });

                    // Default JSON-request options.
                    var params = {type: type, dataType: 'json'};

                    // Ensure that we have a URL.
                    if (!options.url) {
                        //params.url = _.result(model, 'url') || urlError();
                        params.url = (_.isFunction(model.url) ? model.url(method,options) : model.url) || urlError();
                    }

                    // Ensure that we have the appropriate request data.
                    if (options.data == null && model && (method === 'create' || method === 'update' || method === 'patch')) {
                        params.contentType = 'application/json';
                        params.data = JSON.stringify(options.attrs || model.toJSON(options));
                    }

                    // For older servers, emulate JSON by encoding the request into an HTML-form.
                    if (options.emulateJSON) {
                        params.contentType = 'application/x-www-form-urlencoded';
                        params.data = params.data ? {model: params.data} : {};
                    }

                    // For older servers, emulate HTTP by mimicking the HTTP method with `_method`
                    // And an `X-HTTP-Method-Override` header.
                    if (options.emulateHTTP && (type === 'PUT' || type === 'DELETE' || type === 'PATCH')) {
                        params.type = 'POST';
                        if (options.emulateJSON) params.data._method = type;
                        var beforeSend = options.beforeSend;
                        options.beforeSend = function (xhr) {
                            xhr.setRequestHeader('X-HTTP-Method-Override', type);
                            if (beforeSend) return beforeSend.apply(this, arguments);
                        };
                    }

                    // Don't process data on a non-GET request.
                    if (params.type !== 'GET' && !options.emulateJSON) {
                        params.processData = false;
                    }

                    // Pass along `textStatus` and `errorThrown` from jQuery.
                    var error = options.error;
                    options.error = function (xhr, textStatus, errorThrown) {
                        options.textStatus = textStatus;
                        options.errorThrown = errorThrown;
                        if (error) error.call(options.context, xhr, textStatus, errorThrown);
                    };

                    // Make the request, allowing the user to override any Ajax options.
                    var xhr = options.xhr = Backbone.ajax(_.extend(params, options));
                    model.trigger('request', model, xhr, options);
                    return xhr;
                }


            },

            { //class properties

                newInstance: function () {

                }

            });


        return BaseModel;
    })
;