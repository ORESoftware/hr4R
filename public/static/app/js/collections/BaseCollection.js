/**
 * Created by amills001c on 7/24/15.
 */


console.log('loading app/js/collections/jobsCollection.js');


define(
    [
        'underscore',
        'backbone',
        'async',
        'app/js/collections/BaseCollectionPrototype'
    ],

    function (_, Backbone, async, baseCollectionPrototype) {

        var BaseCollection = Backbone.Collection.extend(baseCollectionPrototype);

        return BaseCollection;

    });