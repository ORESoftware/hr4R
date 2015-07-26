/**
 * Created by amills001c on 7/24/15.
 */


console.log('loading app/js/collections/jobsCollection.js');


define(
    [
        'underscore',
        'backbone',
        'async'
    ],

    function (_, Backbone, async) {

        var BaseCollection = Backbone.Collection.extend({

            collNeedsPersisting: false,

            constructor: function () {
                var self = this;
                this.on('change',function(model,something){
                    self.collNeedsPersisting = true;
                    self.trigger('model-change',model,model.changed);
                });
                this.on('add',function(model,something){
                    self.collNeedsPersisting = true;
                    //self.trigger('model-change',model,model.changed);
                });
                this.on('sync',function(){
                    self.collNeedsPersisting = false;
                });
                Backbone.Collection.apply(this, arguments);
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

            saveCollection: function(){
                Backbone.sync('create', this, {
                    success: function() {
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
        });

        return BaseCollection;

    });