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
  TODO:
// To cater to internet explorer, you have to set the stylesheet to be disabled as it keeps the css styles in memory so removing the element will not work, it can also cause it to crash in some instances if I remember correctly.

This also works for cross browser.

    e.g

document.styleSheets[0].disabled = true;
//so in your case using jquery try

$('link[title=mystyle]')[0].disabled=true;

*/


console.log('loading app/js/APP.js');


define(
    [
        //'d3',
        '#patches',
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
        '#allRelViews',
        '#allCSS'
        //'app/js/giant'


    ],

    function (patches, boot, Observe, Backbone, _, IJSON,
              React, collections, models, router, allTemplates,
              allControllers, allRelViews, allCSS) {

        /*
         we don't use the majority of these dependencies in this file, but they are loaded here so that r.js can build
         the optimized file
         */

        //d3.select("body").transition().delay(1750)
        //    .style("background-color", "#919191");


        //alert(allControllers['app/js/controllers/jobs'].default());
        //
        //require(['app/js/controllers/jobs'],function(x){
        //    console.log('EUROOOOKA!!!!');
        //    alert(x.default());
        //});



        //window.throwGlobalError(new Error('whoa'));

        if (typeof String.prototype.startsWith !== 'function') {
            // see below for better implementation!
            String.prototype.startsWith = function (str){
                return this.indexOf(str) === 0;
            };
        }

        if(window.location.hash && String(window.location.hash).length > 1 && String(window.location.hash).charAt(0) ==='#'){
            var hash = String(window.location.hash).substring(1);
            console.log('original_hash_request:',hash);
            if(hash == 'index'){
                hash = 'home';  //prevent user from being stuck at the index page after logging in
            }
            saveToLocalStorage('original_hash_request',hash);
        }
        else{
            console.log('no hash in URL seen, setting desired hash to "home"');
            saveToLocalStorage('original_hash_request','home');
        }

        Backbone.setCollectionOptions = function (model, options) {


        };

        Backbone.View.prototype.setViewProps = function (options) {

            var opts = options || {};

            var temp = _.defaults({}, opts, _.result(this, 'defaults'));

            //var temp = _.defaults(_.result(this, 'defaults'),opts);

            //_.defaults(this, _.result(this, 'defaults'));
            //
            //console.log(this);

           //_.defaults(view, opts, _.result(view, 'defaults'));
           //
           // console.log(view);

            for(var prop in temp){
                if(temp.hasOwnProperty(prop) && prop !== undefined){
                    if(temp[prop]!==undefined){
                        this[prop] = temp[prop];
                        //console.log('new view property:',this[prop]);
                    }
                }
            }
        };

        Backbone.syncCollection = function (collection, cb) {

            collection.persistCollection({}, function (err, results) {
                if (err) {
                    cb(err);
                }
                else {
                    //TODO: fire events here to signify that collection has been persisted, needsPersistence is false

                    collection.fetch(
                        {
                            success: function (msg) {
                                //TODO: fire events here to signify to adhesive views to update DOM elements
                                cb(null, msg);
                            },
                            error: function (err) {
                                cb(err)
                            }
                        });
                }
            });
        };

        Backbone.batchSyncCollection = function (collection, cb) {

            var batchData = {create: [], destroy: [], update: []};

            for (var i = 0; i < collection.models.length; i++) {

                var model = collection.models[i];
                batchData.update.push(model.toJSON());
            }

            $.ajax({
                type: "POST",
                url: collection.batchURL,
                dataType: "json",
                data: batchData
            }).done(function (msg) {

                console.log(msg);
                cb(msg);

            }).fail(function (msg) {

                console.log(msg);
                cb(msg);

            }).always(function (msg) {

                console.log(msg);
                cb(msg);

            });
        };

        //Backbone.batchSyncCollection(collections.users, function (msg) {
        //    console.log(IJSON.parse(msg));
        //});

        Backbone.batchSaveCollection = function (collection, cb) {

            collection.persist(function (err, res) {
                if (err) {
                    cb(err);
                }
                else {
                    collection.fetch(
                        {
                            success: function (msg) {
                                cb(null, msg);
                            },
                            error: function (err) {
                                cb(err)
                            }
                        });
                    //TODO: convert this to done,fail,always
                }
            });
        };


        /*    window.onbeforeunload = function() {  //user confirms he wants to leave page
         return "Dude, are you sure you want to leave? Think of the kittens!";
         };*/  //TODO: window.onbeforeload, persist all connections


        var start = function () {
            //TODO: boot should be included in optimized build

            console.log('app.start() fired, boot.initialize() about to fire, time:', (Date.now() -window.startDate));
            //require(['app/js/boot'], function (boot) {

                //console.log('boot.initialize() waiting for document.ready to fire, time:', (Date.now() -window.startDate));
                //$(function() {  //DOM is ready
                //    console.log('document.ready fired, time:', (Date.now() -window.startDate));
                    boot.initialize();
                //});
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