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
        requireLib : 'vendor/require',
        jqueryUI: "empty:",
        jqueryUI_CSS: "empty:"
    },

    "include": ['requireLib','app/js/application','app/js/boot'],
    "stubModules":['text']
    //"stubModules": ['jsx', 'text', 'JSXTransformer'],
    //"modules": [
    //    {
    //        name: "main"
    //    }
    //]
})