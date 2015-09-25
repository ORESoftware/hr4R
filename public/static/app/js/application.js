/**
 * Created by denmanm1 on 6/9/15.
 */


//TODO: http://webdeveloperpost.com/Articles/10-most-useful-jQuery-functions-for-your-website.aspx
//TODO: http://alfredkam.com/goodbye-marionette-hello-react/
//TODO: http://www.toptal.com/front-end/simple-data-flow-in-react-applications-using-flux-and-backbone
//TODO: http://www.gianlucaguarini.com/blog/rivet-js-backbone-js-made-my-code-awesome/
//TODO: http://kwilson.me.uk/blog/inject-css-from-your-requirejs-module-into-the-main-app/
//TODO: http://www.w3.org/wiki/Dynamic_style_-_manipulating_CSS_with_JavaScript


console.log('loading app/js/APP.js');

define(
    [
        '*windowPatches',
        '*backbonePatches',
        '*jsPatches',
        'observe',
        'backbone',
        'jquery',
        'underscore',
        'ijson',
        'react'
    ],

    /*
     we don't use the majority of these dependencies in this file, but they are loaded here so that (1) r.js can build
     the optimized file, and (2) so that we can do synchronous requires later on in our application

     note: anything dependent on Backbone needs to be loaded in the next file (boot.js)
     */

    function (windowPatches, backbonePatches, jsPatches, Observe, Backbone, $, _, IJSON, React) {


        /////////////////////////////////////
        debugger; //debugger should stop here
        /////////////////////////////////////


        //////NOTE: we will use the global Backbone and jQuery instances throughout the app///////
        window.React = React; // export for http://fb.me/react-devtools
        window.IJSON = window.ijson = IJSON;


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

            console.log('app.start() fired, boot module is start to load...time:', (Date.now() - window.startDate));

            //we want to load patches before loading any other files
            require(['app/js/boot'], function (boot) {

                console.log('boot.initialize() about to fire, time:', (Date.now() - window.startDate));
                boot.initialize();
            });

        };

        return {
            start: start
        };
    },


    function (error) {  //this is called an "errback"
        console.log('Custom error-back handler', error);
        //error.requireModules : is Array of all failed modules
        var failedId = error.requireModules && error.requireModules[0];
        console.log(failedId);
        console.log(error.message);
    });