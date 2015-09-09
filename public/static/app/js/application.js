/**
 * Created by amills001c on 6/9/15.
 */

// 752,115 chars in optimized file

//TODO: http://webdeveloperpost.com/Articles/10-most-useful-jQuery-functions-for-your-website.aspx
//TODO: http://alfredkam.com/goodbye-marionette-hello-react/
//TODO: http://www.toptal.com/front-end/simple-data-flow-in-react-applications-using-flux-and-backbone
//TODO: http://www.gianlucaguarini.com/blog/rivet-js-backbone-js-made-my-code-awesome/
//TODO: http://kwilson.me.uk/blog/inject-css-from-your-requirejs-module-into-the-main-app/
//TODO: http://www.w3.org/wiki/Dynamic_style_-_manipulating_CSS_with_JavaScript


/*
TODO

hot reloading with RequireJS -

 http://stackoverflow.com/questions/19966133/how-to-reload-a-file-via-require-js-triggered-from-the-browsers-js-console

*/

/*
 TODO:

 To cater to internet explorer, you have to set the stylesheet to be disabled as it keeps the css styles in memory so removing the element will not work,
 it can also cause it to crash in some instances if I remember correctly.

 This also works for cross browser.

 e.g

 document.styleSheets[0].disabled = true;
 //so in your case using jquery try

 $('link[title=mystyle]')[0].disabled=true;

 */


console.log('loading app/js/APP.js');


define(
    [
        '#windowPatches',
        '#backbonePatches',
        '#jsPatches',
        'app/js/hotReload',
        'app/js/boot',
        'observe',
        'backbone',
        'underscore',
        'ijson',
        'react',
        '#allCollections',
        '#allModels',
        'app/js/routers/router',
        '#allTemplates',
        '#allControllers',
        '#allViews',
        '#allCSS'
    ],

    /*
     we don't use the majority of these dependencies in this file, but they are loaded here so that r.js can build
     the optimized file
     */

    function (windowPatches,backbonePatches,jsPatches, hotReload, boot, Observe, Backbone, _, IJSON,
              React, collections, models, router, allTemplates, allControllers, allViews, allCSS) {


        /////////////////////////////////////
        debugger; //debugger should stop here
        /////////////////////////////////////


        if (window.location.hash && String(window.location.hash).length > 1 && String(window.location.hash).charAt(0) === '#') {
            var hash = String(window.location.hash).substring(1);
            console.log('original_hash_request:', hash);
            if (hash == 'index') {
                hash = 'home';  //prevent user from being stuck at the index page after logging in
            }
            saveToLocalStorage('original_hash_request', hash);
        }
        else {
            console.log('no hash in URL seen, setting desired hash to "home"');
            saveToLocalStorage('original_hash_request', 'home');
        }


        /*    window.onbeforeunload = function() {  //user confirms he wants to leave page
         return "Dude, are you sure you want to leave? Think of the kittens!";
         };*/  //TODO: window.onbeforeload, persist all connections


        var start = function () {

            console.log('app.start() fired, boot.initialize() about to fire, time:', (Date.now() - window.startDate));
            //require(['app/js/boot'], function (boot) {

            boot.initialize();

            //});

        };

        return {
            start: start
        };
    },


    function (error) {  //this is called an "errback"
        console.log('Custom ERROR handler', error);
        //error.requireModules : is Array of all failed modules
        var failedId = error.requireModules && error.requireModules[0];
        console.log(failedId);
        console.log(error.message);
    });