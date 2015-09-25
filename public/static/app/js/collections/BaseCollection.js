/**
 * Created by denmanm1 on 7/24/15.
 */


console.log('loading app/js/collections/BaseCollection.js');


define(
    [
        'underscore',
        'async',
        'app/js/collections/BaseCollectionPrototype'
    ],

    function (_, async, baseCollectionPrototype) {

        var BaseCollection = Backbone.Collection.extend(baseCollectionPrototype);

        return BaseCollection;

    });