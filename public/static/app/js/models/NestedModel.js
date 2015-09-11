/**
 * Created by amills001c on 8/5/15.
 */



console.log('loading app/js/models/NestedModel.js');

//TODO: In model, urlRoot is used for the Model. url is used for the instance of the Model.
//TODO: http://beletsky.net/2012/11/baby-steps-to-backbonejs-model.html
//TODO: http://christianalfoni.github.io/javascript/2014/10/22/nailing-that-validation-with-reactjs.html
//TODO: http://product.hubspot.com/blog/5-rules-for-better-backbone-code


define(
    [
        '#appState',
        'underscore',
    ],

    function (appState, _) {

        var NestedModel = Backbone.Model.extend({

                needsPersisting: false,
                nestedModel: true,

                constructor: function () {
                    this.parent = arguments[0];
                    if(this.parent == null){
                        throw new Error('no parent sent to nested model');
                    }
                    //var args = arguments.shift();
                    Array.prototype.shift.apply(arguments);
                    var self = this;
                    this.on('change', function (model, something) {
                        //self.needsPersisting = true;
                        self.parent.trigger('change-child',self);
                    });
                    this.on('change-child', function (model, something) {
                        //self.needsPersisting = true;
                        self.parent.trigger('change-child',self);
                    });
                    this.on('sync', function () {
                        self.needsPersisting = false;
                    });
                    Backbone.Model.apply(this, arguments);
                },

                save: function(){
                    throw new Error('called save on a nested model type');
                },

                persistModel: function(){
                    throw new Error('called persistModel on a nested model type');
                }


                //set: function(key, value, options) { //this is also known as (attributes,options)
                //
                //    if(options && options.localChange){
                //       this.trigger('model-local-change-broadcast',this);
                //    }
                //
                //    return Backbone.Model.prototype.set.apply(this, arguments);
                //},

            },

            { //class properties

            });


        return NestedModel;
    });