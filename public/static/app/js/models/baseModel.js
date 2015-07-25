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
        'underscore',
        'backbone',
        'ijson'
    ],

    function (_, Backbone,IJSON) {

        var BaseModel = Backbone.Model.extend({

                needsPersisting: false,

                constructor: function () {
                    var self = this;
                    this.on('change',function(model,something){
                        self.needsPersisting = true;
                    });
                    this.on('sync',function(){
                        self.needsPersisting = false;
                    });
                    Backbone.Model.apply(this, arguments);
                },

                persistModel: function (attributes, opts, callback) {

                    if(this.needsPersisting){
                        var self = this;
                        //TODO: add opts to object below
                        self.save(attributes, {
                            wait: true, //prevents optimistic persist
                            dataType: "json",
                            //TODO:  model.trigger('sync', model, resp, options);
                            success: function (model, response, options) {
                                self.needsPersisting = false;
                                callback(null,model, IJSON.parse(response), options);
                            },
                            error: function (model, xhr, options) {
                                var err = new Error("Something went wrong while saving the model");
                                callback(err, model, xhr, options);
                            }
                        });
                    }
                    else{
                        console.log('avoided unnecessarily saving model to server:',this);
                        callback(null,this,null,null);
                    }

                },

                deleteModel: function (opts,callback) {
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
            },

            { //class properties

            });


        return BaseModel;
    });