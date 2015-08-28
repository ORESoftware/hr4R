/**
 * Created by amills001c on 6/30/15.
 */


({
    //"optimizeAllPluginResources": true,
    "preserveLicenseComments": false,
    "baseUrl": "../public/static",
    "name": "app/js/main",
    "mainConfigFile": "../public/static/app/js/main.js",
    "out": "../public/static/app/optimized/optimized.js",
    "paths" :{
        requireLib : 'vendor/require'
    },

    "include": 'requireLib',
    //"stubModules": ['jsx', 'text', 'JSXTransformer'],
    //"modules": [
    //    {
    //        name: "main"
    //    }
    //]
})