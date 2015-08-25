/**
 * Created by amills001c on 7/28/15.
 */


define(
    [
        'backbone',
        'underscore',
        'async'
    ],

    function (Backbone, _, async) {

        var addOptions = {add: true, remove: false};

        return {

            collNeedsPersisting: false,
            numberOfFetches:0, //TODO: once this is 1 or greater, we don't need to keep fetching, we can let websockets do the work

            fetchCap:2,
            changedModelsToBatchUpdateDomWith: {},
            addedModelsToBatchUpdateDomWith: {},

            batchURL: null,


            constructor: function () {
                var self = this;

                this.on('change', function (model, something) {
                    self.collNeedsPersisting = true;
                    //var obj = {};
                    //obj[model.cid] = {model:model,changed:model.changed}
                    //self.trigger('coll-change', obj, 'coll-change');
                });
                this.on('add', function (model, something) {
                    self.collNeedsPersisting = true;
                    //var obj = {};
                    //obj[model.cid] = {model:model,changed:model.changed}
                    //self.trigger('coll-add', obj, 'coll-add');
                });

                this.on('localCollAdd', function (model, something) {
                    self.collNeedsPersisting = true;
                    //var obj = {};
                    //obj[model.cid] = {model:model,changed:model.changed}
                    //self.trigger('coll-add', obj, 'coll-add');
                });

                this.on('sync', function () {
                    //self.collNeedsPersisting = false;
                    //TODO: 'sync' event is fired on collection.fetch so can't set collNeedsPersisting to false in that case
                });

                //this.on('model-local-change',function(model,something){
                //    var obj = {};
                //    obj[model.cid] = {model:model,changed:model.changed};
                //    self.trigger('model-local-change-broadcast', obj, 'model-local-change-broadcast');
                //});

                this.on('model-local-change-broadcast', function (model, something) {
                    var temp = {};
                    temp[model.cid] = {model: model, changed: model.changed};
                    self.trigger('coll-local-change-broadcast', temp, 'coll-local-change-broadcast');
                });

                this.on('coll-change-socket', function (model, something) {
                    //if(model._id){ //TODO: only need to update DOM for models already saved on the server?
                    //    self.modelsToBatchUpdateDomWith.push(model);
                    //}
                    //self.modelsToBatchUpdateDomWith.push(model);
                    self.changedModelsToBatchUpdateDomWith[model.cid] = {model: model, changed: model.changed};

                    var func = (_.debounce(function () {
                        var temp = self.changedModelsToBatchUpdateDomWith;
                        self.changedModelsToBatchUpdateDomWith = {};
                        self.trigger('coll-socket-change-broadcast', temp, 'coll-socket-change-broadcast');
                    }, 100))(); //delay DOM updates by at least 100 seconds in order to batch updates

                });

                this.on('coll-add-socket', function (model, something) {
                    //self.collNeedsPersisting = true;

                    self.addedModelsToBatchUpdateDomWith[model.cid] = {model: model, changed: model.changed};

                    var func = (_.debounce(function () {
                        var temp = self.addedModelsToBatchUpdateDomWith;
                        self.addedModelsToBatchUpdateDomWith = {};
                        self.trigger('coll-socket-add-broadcast', temp, 'coll-socket-add-broadcast');
                    }, 100))(); //delay DOM updates by at least 100 seconds in order to batch updates

                });

                Backbone.Collection.apply(this, arguments);
            },

            sync: function() {
                //TODO: how does Backbone handle REST HTTP responses from saving models/collections? somehow with jQuery...
                return Backbone.sync.apply(this, arguments);
            },

            add: function(models, options) {
                var opts = options || {};
                if(opts.localCollAdd === true){ //TODO: perhaps move this into the set function and find out how many models were merged and how many were brand new
                    this.trigger('localCollAdd',models,'localCollAdd');
                }
                return this.set(models, _.extend({merge: false}, options, addOptions));
            },

            sortByCID: function () {
                this.sortBy(function (model) {
                    return model.cid;
                });
            },

            sortByDateCreated: function () {
                this.sortBy(function (model) {
                    return model.get('created_at');
                });
            },

            sortByAttribute: function (attr) {
                this.sortBy(function (model) {
                    return model.get(attr);
                });
            },

            insertModelSocket: function (_id, data, opts) {

                var self = this;

                for (var i = 0; i < this.models.length; i++) {
                    var model = this.models[i];
                    if (String(model.get('_id')) == String(_id)) {
                        model.set(data, {silent: true, socketChange: true});
                        self.trigger('coll-change-socket', model, {});
                        return;
                    }
                }

                var ModelType = this.model;
                var newModel = new ModelType(data);
                this.add(newModel, {silent: true});
                this.trigger('coll-add-socket', newModel, {});
            },

            updateModelSocket: function (_id, data, opts) {

                var self = this;

                for (var i = 0; i < this.models.length; i++) {
                    var model = this.models[i];
                    if (String(model.get('_id')) == String(_id)) {
                        model.set(data, {silent: true, socketChange: true});
                        self.trigger('coll-change-socket', model, {});
                        return;
                    }
                }

                var ModelType = this.model;
                var newModel = new ModelType(data);
                this.add(newModel, {silent: true}); //TODO: why silent??
                this.trigger('coll-add-socket', newModel, {});
            },

            removeModelSocket: function (_id, opts) {

                var self = this;

                for (var i = 0; i < this.models.length; i++) {
                    var model = this.models[i];
                    if (String(model.get('_id')) == String(_id)) {
                        self.remove(model);
                        self.trigger('coll-remove-socket', model, {});
                        break;
                    }
                }
            },

            parse: function (resp) {
                if (resp.success) {
                    return resp.success;
                }
                else if (resp.error) {
                    return this.models;
                }
                else {
                    return resp;
                }
            },

            saveCollection: function () {
                Backbone.sync('create', this, {
                    success: function () {
                        console.log('Saved!');
                    }
                });
            },

            persistCollection: function (opts, cb) {

                //TODO: use opts to set same value for all models (?)

                var saveArray = [];

                var self = this;

                this.each(function (model, index) {  //iterate through models, add/push function to async.parallel
                    if(model.needsPersisting === true){
                        saveArray.push(
                            function (callback) {
                                model.persistModel(null, null, function (err, val) {
                                    callback(err, val);
                                });
                            }
                        )
                    }
                });

                async.parallel(saveArray, function (err, results) {
                    self.collNeedsPersisting = false;
                    cb(err, results);
                });

            },

            persistCollectionBatch: function (opts, cb) {

                //TODO: use opts to set same value for all models

                var opts = opts || {};

                var self = this;

                var filterFunction = opts.filterFunction;

                var saveArray = [];

                this.each(function (model, index) {  //iterate through models, add/push function to async.parallel
                    if(!(opts.needsPersisting && model.needsPersisting)){
                        saveArray.push(model.toJSON());
                    }
                });

                var json = {models:saveArray};

                $.ajax({
                    url: self.batchURL,
                    data: JSON.stringify(json),
                    dataType: 'json',
                    type: 'POST',
                    contentType: "application/json"

                }).done(function (msg, textStatus, jqXHR) {
                    cb(null, msg, textStatus, jqXHR);

                }).fail(function (jqXHR, textStatus, errorThrown) {
                    alert('collection batch persist failed - ' + errorThrown);

                }).always(function (a, textStatus, b) {

                });

            }
        }

    });