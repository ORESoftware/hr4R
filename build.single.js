/**
 * Created by amills001c on 6/30/15.
 */


({
    "baseUrl": "./public/static",
        name: "../app",
    "out": "./public/static/app/js/optimized.js",

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
        'socketio':'vendor/socketio'
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
})