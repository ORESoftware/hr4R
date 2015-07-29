/**
 * Created by amills001c on 7/28/15.
 */


//TODO: this will probably only be useful for "collections of collections" if this is needed at all

define(

    [
        'observe',
        'backbone',
        'underscore',
        'app/js/baseCollectionPrototype'
    ],

    function (Observe,Backbone,_, baseCollectionPrototype) {

        return function(opts){

            var completePrototype = _.defaults({},opts,baseCollectionPrototype);

            return new Backbone.Collection.extend(completePrototype);
        }

    });