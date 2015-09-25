/**
 * Created by denmanm1 on 7/24/15.
 */


var BaseCollection = Backbone.Collection.extend({
    constructor: function () {
        // your base collection constructor

        // run the Backbone.Collection constructor on this
        Backbone.Collection.apply(this, arguments);
    }
});

// extends methods on BaseCollection
var UserCollection = BaseCollection.extend({
    constructor: function () {
        // your user collection constructor

        // run the BaseCollection constructor on this
        BaseCollection.apply(this, arguments);
    }
});