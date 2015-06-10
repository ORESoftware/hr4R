/**
 * Created by amills001c on 6/9/15.
 */


define(['app/js/collections','jquery', 'underscore', 'handlebars', 'backbone'], function (collections, $, _, Handlebars, Backbone) {

//define(['handlebars', 'backbone'], function(Handlebars, Backbone) {

    console.log('jquery:', Backbone.$);
    console.log('underscore:', _);


    var SomeView = Backbone.View.extend({
        initialize: function () {
            _.bindAll(this, "render");
            this.collection.bind("reset", this.render);
        },
        render: function () {
            var template = Handlebars.compile($('#template-someview').html());
            var rendered = template(this.getContext());
        }
    });

    return {
        SomeView: new SomeView({
            collection: collections.todos,
            el : null
        })
    };
});