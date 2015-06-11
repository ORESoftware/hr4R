/**
 * Created by amills001c on 6/9/15.
 */



//define(['app/js/views','handlebars', 'backbone'], function(views,Handlebars, Backbone) {

define(['app/js/views', 'handlebars', 'backbone'], function (views, Handlebars, Backbone) {

    var start = function () {

        require(['app/js/boot'], function (boot) {
            boot.initialize();
        });
    };

    return {
        start: start
    };
});