/**
 * Created by amills001c on 6/9/15.
 */


//TODO: http://webdeveloperpost.com/Articles/10-most-useful-jQuery-functions-for-your-website.aspx
//TODO: http://alfredkam.com/goodbye-marionette-hello-react/
//TODO: http://www.toptal.com/front-end/simple-data-flow-in-react-applications-using-flux-and-backbone
//TODO: http://www.gianlucaguarini.com/blog/rivet-js-backbone-js-made-my-code-awesome/
//TODO: http://kwilson.me.uk/blog/inject-css-from-your-requirejs-module-into-the-main-app/

console.log('loading app/js/APP.js');

/*
 window.appGlobal = {

 //unfortunately, can't really avoid global variables,
 // because templates need to access certain variables without have to re-inject variable values into templates

 authorized: null,  //boolean
 currentUser: null, //Backbone.Model
 env: null    //object

 };
 */


window.no_op = function () {
};
window.no_op_err = function () {
    throw new Error('this no_op function should not have been called.')
};


window.saveToLocalStorage = function (key, val) {
    var str = JSON.stringify(val);
    localStorage.setItem(key, str);
};


window.readFromLocalStorage = function (key) {
    var val = localStorage.getItem(key);
    return JSON.parse(val);
};


define(
    [
        'handlebars',
        'backbone',
        'underscore',
        'ijson',
        'react',
        'app/js/allCollections',
        'app/js/allViews',
        'app/js/allTemplates',
        'jsx!app/js/views/todoList',
        'app/js/giant'

    ],

    function (Handlebars, Backbone, _, IJSON, React, collections, allViews, allTemplates, todoList, giant) {


        /*
         we don't use the majority of these files, but they are loaded here so that r.js can build
         the optimized file
         */

        Backbone.setModelOptions = function(model,options){

            var ret = {};
            var opts = options || {};

            //ret = _.extend(ret,opts);

            if(opts.collection !== undefined){
                ret.collection = opts.collection;
            }

        };

        Backbone.assignModelOptions = function(model,options){

            for(var opt in options){
                if(options.hasOwnProperty(opt)){

                    model[opt] = options[opt];
                }

            }

        };

        Backbone.setCollectionOptions = function(model,options){


        };

        Backbone.setViewProps1 = function(model,options,defaults){

            var ret = {};
            var opts = options || {};

            //we only set values if they are sent in defined
            //this allows us to override existing values if we pass in null, but not undefined
            if(opts.collection !== undefined){
                ret.collection = opts.collection;
                delete opts.collection;
            }
            if(opts.model !== undefined){
                ret.model = opts.model;
                delete opts.model;
            }

            console.log('unused options for',model.givenName,':',opts);

            ret = _.extend(ret,opts);
            return ret;

        };

        Backbone.setViewProps = function(view,options){

            var opts = options || {};

            var temp = _.defaults({}, opts, _.result(view, 'defaults'));

            for(var prop in temp){
                if(temp.hasOwnProperty(prop)){
                    if(temp[prop]!==undefined){
                        view[prop] = temp[prop];
                        console.log('new view property:',view[prop]);
                    }
                }
            }

        };

        Backbone.syncCollection = function (collection, cb) {

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

            }).always(function(msg){

                console.log(msg);
                cb(msg);

            });
        };

        Backbone.batchSyncCollection(collections.users,function(msg){
                 console.log(msg+'!!!!!');
        });

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
                }
            });
        };


        /*    window.onbeforeunload = function() {  //user confirms he wants to leave page

         Object.keys(collections).forEach(function(key){
         if (collections.hasOwnProperty(key)) {

         var coll = collections[key];
         coll.persist(function (err, res) {
         if(err){
         console.log(err);
         }
         });
         }
         });



         return "Dude, are you sure you want to leave? Think of the kittens!";

         };*/  //TODO: window.onbeforeload

        /*var x = IJSON.parse({});

         console.log(x);*/  //TODO: IJSON

        /* Backbone.Events.listenTo({},'event1',function(msg){
         console.log(msg);
         });

         Backbone.Events.on('event1',function(msg){
         alert(msg);
         });

         Backbone.Events.trigger('event1','hiiii');*/ //TODO: backbone events


        var start = function () {

            require(['app/js/boot'], function (boot) {
                boot.initialize();
            });
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