/**
 * Created by amills001c on 6/9/15.
 */

//http://ozkatz.github.io/converting-an-existing-backbonejs-project-to-requirejs.html
//https://github.com/volojs/create-template

//requirejs.config({
require.config({
    'baseUrl': '/static',
    'paths': {
        //'app': 'app/js',
        // define vendor paths
        'jquery': 'js/vendor/jquery.min',
        'underscore': 'js/vendor/underscore-min',
        'backbone': 'js/vendor/backbone-min',
        'bootstrap': 'js/vendor/bootstrap.min',
        'handlebars': 'js/vendor/handlebars.min'
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