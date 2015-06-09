/**
 * Created by amills001c on 6/9/15.
 */


//define(['jquery', 'underscore','handlebars', 'backbone'], function($, _, Handlebars, Backbone) {

define(['handlebars', 'backbone'], function(Handlebars, Backbone) {

    console.log('jquery:', Backbone.$);
    console.log('underscore:', Backbone._);



    var SomeView = Backbone.view.extend({
        initialize: function () {
            _.bindAll(this, "render");
            this.collection.bind("reset", this.render);
        },
        render: function() {
            var template = Handlebars.compile( $('#template-someview').html() );
            var rendered = template(this.getContext());

        }

    });

    console.log('in views...');

    return {
        'SomeView': SomeView
    };
});