/**
 * Created by amills001c on 6/9/15.
 */

//http://ozkatz.github.io/converting-an-existing-backbonejs-project-to-requirejs.html
//https://github.com/volojs/create-template
//http://www.webdeveasy.com/optimize-requirejs-projects/
//https://github.com/tastejs/todomvc/tree/gh-pages/examples/backbone_require

requirejs.config({
    'baseUrl': '/static',
    'paths': {
        //'app': 'app/js',
        // define vendor paths
        'jquery': 'js/vendor/jquery',
        'underscore': 'js/vendor/underscore',
        'backbone': 'js/vendor/backbone',
        'bootstrap': 'js/vendor/bootstrap',
        'handlebars': 'js/vendor/handlebars',
        'backbone-validation': 'js/vendor/backbone-validation-amd'
    },
    // Shim declaration
    'shim': {
        'underscore': {
            'exports': '_'
        },
        'backbone': {
            'deps': ['jquery', 'underscore'],
            'exports': 'Backbone'
        },
        'handlebars': {
            'exports': 'Handlebars'
        }
    }
});

require(['app/js/app'], function(Application) {
    //var app = new Application();
    //app.start(); // or whatever startup logic your app uses.
    var app = Application.start();
});

//require(['app/js/commonjs'], function(value) {
//    //var app = new Application();
//    //app.start(); // or whatever startup logic your app uses.
//    console.log(value);
//});
//
//
//require(['app/js/commonjs2'], function(value) {
//    //var app = new Application();
//    //app.start(); // or whatever startup logic your app uses.
//    console.log(value);
//});