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
//TODO: Safari doesn't accept gzip compression?

window.startDate = Date.now();

console.log('loading app/js/main.js, (1) time:', (Date.now() - window.startDate));

requirejs.config({
    enforceDefine: false,
    waitSeconds: 997,
    baseUrl: '/static',
    paths: {
        'async': 'vendor/async',
        'jquery': 'vendor/jquery',
        //'jquery': 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.0.0-alpha1/jquery.min',
        'ejs': 'vendor/ejs',
        'flux': 'vendor/Flux',
        'text': 'vendor/text',
        'form2js': 'vendor/form2js',
        'underscore': 'vendor/underscore-min',
        'ijson': 'vendor/idempotent-json',
        'backbone': 'vendor/backbone',
        'bootstrap': 'vendor/bootstrap',
        'backbone-validation': 'vendor/backbone-validation-amd',
        'observe': 'vendor/observe',
        'react': 'vendor/react-with-addons',
        //'react': 'vendor/react',
        'socketio': 'vendor/socketio',
        'events': 'vendor/events-amd',
        //'socketio' : 'https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.3.6/socket.io.min',
        //'Adhesive':'app/js/Adhesive',
        '#jsPatches': 'app/js/patches/jsPatches',
        '#backbonePatches': 'app/js/patches/backbonePatches',
        '#windowPatches': 'app/js/patches/windowPatches',
        //'#allReactComponents': 'app/js/meta/allReactComponents',
        //'#allRelViews': 'app/js/meta/allRelViews',
        '#allTemplates': 'app/js/meta/allTemplates',
        //'#allStandardViews': 'app/js/meta/allStandardViews',
        '#allViews': 'app/js/meta/allViews',
        '#allModels': 'app/js/meta/allModels',
        '#allCollections': 'app/js/meta/allCollections',
        '#appState': 'app/js/appState',
        '#viewState': 'app/js/viewState',
        '#allControllers': 'app/js/meta/allControllers',
        '#allDispatchers': 'app/js/meta/allDispatchers',
        '#BaseCollection': 'app/js/collections/BaseCollection',
        '@AppDispatcher': 'app/js/flux/dispatcher/AppDispatcher',
        '#allCSS': 'app/js/meta/allCSS',
        '#allFluxActions': 'app/js/meta/allFluxActions',
        '#allFluxConstants': 'app/js/meta/allFluxConstants',
        '#SuperController': 'app/js/controllers/SuperController'
        //'d3':'https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.6/d3.min'
    },

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

console.log('starting app, time:', (Date.now() - window.startDate));


require(['app/js/application'], function (Application) {

    console.log('Application loaded, (2) time:', (Date.now() - window.startDate));

    Application.start();

});


