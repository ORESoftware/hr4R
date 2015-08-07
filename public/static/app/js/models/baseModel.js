/**
 * Created by amills001c on 7/23/15.
 */


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
        '#appState',
        'underscore',
        'backbone',
        'ijson'
    ],

    function (appState, _, Backbone, IJSON) {

        var BaseModel = Backbone.Model.extend({

                needsPersisting: true,

                constructor: function () {
                    var self = this;
                    this.on('change', function (model, something) {
                        self.needsPersisting = true;
                    });
                    this.on('sync', function () {
                        self.needsPersisting = false;
                    });
                    Backbone.Model.apply(this, arguments);
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

                toJSON: function () {
                    // return _.omit(this.attributes, this.stale);
                    var json = _.clone(this.attributes);
                    for (var attr in json) {
                        if ((json[attr] instanceof Backbone.Model) || (json[attr] instanceof Backbone.Collection)) {
                            json[attr] = json[attr].toJSON();
                        }
                    }
                    return json;
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

                    if (this.needsPersisting) {

                        //TODO: add opts to object below
                        //TODO: need to make this work for new user that logs in

                        if (this._id == null && appState.get('currentUser')) {
                            this.set('created_at', Date.now());
                            var str = appState.get('currentUser').get('_id').concat('@').concat(Date.now());
                            this.set('created_by', str);
                        }

                        if (appState.get('currentUser')) {
                            var str = appState.get('currentUser').get('_id').concat('@').concat(Date.now());
                            this.set('updated_by', str);
                        }

                        //this.set('created_by','ooooooh');
                        //this.set('updated_by','jimmy jazz');
                        this.set('updated_at', Date.now());

                        var self = this;
                        this.save(attributes, {
                            wait: true, //prevents optimistic persist
                            dataType: "json",
                            //TODO:  model.trigger('sync', model, resp, options);
                            success: function (model, response, options) {
                                self.needsPersisting = false;
                                if (typeof callback === 'function') {
                                    callback(null, model, IJSON.parse(response), options);
                                }
                            },
                            error: function (model, xhr, options) {
                                var err = new Error("Something went wrong while saving the model");
                                if (typeof callback === 'function') {
                                    callback(err, model, xhr, options);
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
                },


                parse: function (resp, options) {
                    /*
                     parse converts a response into the hash of attributes to be set on the model.
                     The default implementation is just to pass the response along.
                     */
                    if (resp.success) {
                        return resp.success;
                    }
                    else if (resp.error) {
                        return this.attributes;
                    }
                    else {
                        //this will get called when collection parses stuff
                        return resp;
                    }
                }
            },

            { //class properties

            });


        return BaseModel;
    })
;