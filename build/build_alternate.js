/**
 * Created by amills001c on 6/30/15.
 */


({
    //"optimizeAllPluginResources": true,
    "baseUrl": "./public/static",
    "name": "app/js/app",
    "mainConfigFile": "./public/static/app/js/main.js",
    "out": "./public/static/app/js/optimized.js",
    map: {
        '*': {
            'css': 'vendor/css.min' // or whatever the path to require-css is
        }
    },
})