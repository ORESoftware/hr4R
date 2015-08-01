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

        return {

            collNeedsPersisting: false,

            changedModelsToBatchUpdateDomWith: {},
            addedModelsToBatchUpdateDomWith: {},

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

                //this.on('model-local-change',function(model,something){
                //    var obj = {};
                //    obj[model.cid] = {model:model,changed:model.changed};
                //    self.trigger('model-local-change-broadcast', obj, 'model-local-change-broadcast');
                //});

                this.on('model-local-change-broadcast', function (model, something) {
                    var temp = {};
                    temp[model.cid] = {model: model, changed: model.changed};
                    self.trigger('coll-local-change-broadcast', temp,'coll-local-change-broadcast');
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
                        self.trigger('coll-change-socket-broadcast', temp, 'coll-change-socket-broadcast');
                    }, 1500))(); //delay DOM updates by at least 100 seconds in order to batch updates

                });

                this.on('coll-add-socket', function (model, something) {
                    self.collNeedsPersisting = true;

                    self.addedModelsToBatchUpdateDomWith[model.cid] = {model: model, changed: model.changed};

                    var func = (_.debounce(function () {
                        var temp = self.addedModelsToBatchUpdateDomWith;
                        self.addedModelsToBatchUpdateDomWith = {};
                        self.trigger('coll-add-socket-broadcast', temp, 'coll-add-socket-broadcast');
                    }, 100))(); //delay DOM updates by at least 100 seconds in order to batch updates

                });


                this.on('sync', function () {
                    self.collNeedsPersisting = false;
                });
                Backbone.Collection.apply(this, arguments);
            },

            insertModelSocket: function (_id, data, opts) {

                var self = this;

                for (var i = 0; i < this.models.length; i++) {
                    var model = this.models[i];
                    if (String(model.get('_id')) == String(_id)) {
                        model.set(data, opts);
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
                        model.set(data, opts);
                        self.trigger('coll-change-socket', model, {});
                        return;
                    }
                }

                var ModelType = this.model;
                var newModel = new ModelType(data);
                this.add(newModel, {silent: true});
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

                //TODO: use opts to set same value for all models

                var saveArray = [];

                this.each(function (user, index) {  //iterate through models, add/push function to async.parallel
                    saveArray.push(
                        function (callback) {

                            user.persistModel(null, null, function (err, val) {
                                callback(err, val);
                            });
                        }
                    )
                });

                async.parallel(saveArray, function (err, results) {
                    cb(err, results);
                });

            }
        }

    });