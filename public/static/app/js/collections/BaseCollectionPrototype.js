/**
 * Created by amills001c on 7/28/15.
 */


define(

    [
        'backbone',
        'underscore',
        'async'
    ],

    function (Backbone,_, async) {

        return {

            collNeedsPersisting: false,

            modelsToBatchUpdateDomWith: {},

            constructor: function () {
                var self = this;
                this.on('change', function (model, something) {
                    self.collNeedsPersisting = true;
                    //if(model._id){ //TODO: only need to update DOM for models already saved on the server?
                    //    self.modelsToBatchUpdateDomWith.push(model);
                    //}
                    //self.modelsToBatchUpdateDomWith.push(model);
                    self.modelsToBatchUpdateDomWith[model.cid] = {model:model,changed:model.changed};

                    var func = (_.debounce(function(){
                        var temp = self.modelsToBatchUpdateDomWith;
                        self.modelsToBatchUpdateDomWith = {};
                        self.trigger('coll-change', temp);
                    }, 100))(); //delay DOM updates by at least 100 seconds in order to batch updates
                });
                this.on('add', function (model, something) {
                    self.collNeedsPersisting = true;
                    //self.trigger('model-change',model,model.changed);
                });
                this.on('sync', function () {
                    self.collNeedsPersisting = false;
                });
                Backbone.Collection.apply(this, arguments);
            },

            updateModel: function (_id, updateInfo) {

                for (var i = 0; i < this.models.length; i++) {
                    var model = this.models[i];
                    if (String(model.get('_id')) == String(_id)) {
                        //if(model.get('._id') ==_id){
                        model.set(updateInfo);
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