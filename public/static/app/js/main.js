/**
 * Created by amills001c on 6/9/15.
 */

//https://github.com/ccoenraets/nodecellar
//http://ozkatz.github.io/converting-an-existing-backbonejs-project-to-requirejs.html
//https://github.com/volojs/create-template
//http://www.webdeveasy.com/optimize-requirejs-projects/
//https://github.com/tastejs/todomvc/tree/gh-pages/examples/backbone_require
//TODO:

console.log('loading app/js/main.js');

requirejs.config({
    enforceDefine: false,
    waitSeconds: 8,
    baseUrl: '/static',
    paths: {
        //'app': 'app/js',
        // define vendor paths
        'async': 'vendor/async',
        'jquery': 'vendor/jquery',
        'ejs': 'vendor/ejs',
        'text': 'vendor/text',
        'form2js': 'vendor/form2js',
        'underscore': 'vendor/underscore',
        'ijson':'vendor/idempotent-json',
        'backbone': 'vendor/backbone',
        'bootstrap': 'vendor/bootstrap',
        'handlebars': 'vendor/handlebars',
        'backbone-validation': 'vendor/backbone-validation-amd',
        'socketio': 'https://cdn.socket.io/socket.io-1.3.5'
        //'_routers_': 'app/js/routers'
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
        },
        ejs: {
            exports: "ejs"
        }
    }
});

require(['app/js/app'], function (Application) {

    console.log('about to register document.ready call...');
    $(document).ready(function () {
        console.log('document.ready fired, starting application...');
        var app = Application.start();//
    });
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