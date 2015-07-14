/**
 * Created by amills001c on 6/9/15.
 */

//https://github.com/ccoenraets/nodecellar
//http://ozkatz.github.io/converting-an-existing-backbonejs-project-to-requirejs.html
//https://github.com/volojs/create-template
//http://www.webdeveasy.com/optimize-requirejs-projects/
//https://github.com/tastejs/todomvc/tree/gh-pages/examples/backbone_require
//TODO: http://stackoverflow.com/questions/19827912/package-html-templates-in-require-js-optimizer
//TODO: https://cdnjs.com/libraries/backbone.js/tutorials/organizing-backbone-using-modules
//TODO: http://code.tutsplus.com/tutorials/game-on-backbone-and-ember--net-26836
//TODO: http://stackoverflow.com/questions/8780775/text-files-in-the-path-configuration-file
//TODO: http://blog.mayflower.de/3937-Backbone-React.html
//TODO: https://github.com/philix/jsx-requirejs-plugin

console.log('loading app/js/main.js');

requirejs.config({
    enforceDefine: false,
    waitSeconds: 7,
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
        'homeTemplate':'app/templates/homeTemplate.html',
        'jsx': "vendor/jsx",
        'JSXTransformer': 'vendor/JSXTransformer',
        'react':'vendor/react-with-addons',
        'socketio':'vendor/socketio',
        '#appState':'app/js/appState',
        '#viewState':'app/js/viewState'
        //'socketio': 'https://cdn.socket.io/socket.io-1.3.5'
        //'_routers_': 'app/js/routers'
    },

    'shim': {
        'homeTemplate':{
            'deps': ['text']
        },
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
