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
//TODO: agage

(function () {

    window.startDate = Date.now(); //this is for debugging performance of application

    console.log('loading app/js/main.js ---> (0) ---> time:', (Date.now() - window.startDate));

    requirejs.config({
        enforceDefine: false,
        waitSeconds: 7,
        baseUrl: '/static',
        paths: {
            //core npm/bower modules
            'async': 'vendor/async',
            'jquery': 'vendor/jquery',
            //'jqueryUI': 'https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.11.4/jquery-ui',
            //'jqueryUI_CSS':'text!https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.11.4/jquery-ui.css',
            //'jqueryUI_smooth':'text!https://code.jquery.com/ui/1.11.4/themes/smoothness/jquery-ui.css',
            //'jquery': 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.0.0-alpha1/jquery.min',
            'util(NPM)':'vendor/util',
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

            //our modules
            '#Adhesive': 'app/js/adhesive/Adhesive',
            '#hotReloader': 'app/js/hot-reloading/hotReloader',
            '*jsPatches': 'app/js/patches/jsPatches',
            '*backbonePatches': 'app/js/patches/backbonePatches',
            '*windowPatches': 'app/js/patches/windowPatches',
            '+appState': 'app/js/state/appState',
            '+viewState': 'app/js/state/viewState',
            '#allTemplates': 'app/js/meta/allTemplates',
            '#allViews': 'app/js/meta/allViews',
            '#allModels': 'app/js/meta/allModels',
            '#allCollections': 'app/js/meta/allCollections',
            '#allControllers': 'app/js/meta/allControllers',
            '#allDispatchers': 'app/js/meta/allDispatchers',
            '#allCSS': 'app/js/meta/allCSS',
            '#allFluxActions': 'app/js/meta/allFluxActions',
            '#allFluxConstants': 'app/js/meta/allFluxConstants',
            '@oplogSocketClient': 'app/js/oplogSocketClient',
            '@BaseCollection': 'app/js/collections/BaseCollection',
            '@SuperController': 'app/js/controllers/SuperController',
            '@AppDispatcher': 'app/js/flux/dispatcher/AppDispatcher',
            '@Router': 'app/js/routers/router'
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

            ejs: {
                exports: "ejs"
            }
        }

    });

    console.log('starting app ---> (1) ---> time:', (Date.now() - window.startDate));


    define('/////START/////', ['backbone'], function () {

        require(['app/js/application'], function (Application) {
            console.log('Application module loaded ----> (3) ----> time:', (Date.now() - window.startDate));
            Application.start();

        });
    });

    require(['/////START/////'], function () {
        console.log('starting application ---> (2) ----> time:', (Date.now() - window.startDate))
    });


})();



