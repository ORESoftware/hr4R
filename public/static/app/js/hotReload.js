/**
 * Created by amills001c on 8/27/15.
 */


/**
 * Created by amills001c on 6/17/15.
 */


//http://devble.com/create-cookies-in-javascript-read-values/
//TODO: http://geeks.bizzabo.com/post/83917692143/7-battle-tested-backbonejs-rules-for-amazing-web-apps
//TODO: https://www.compose.io/articles/the-mongodb-oplog-and-node-js/
//TODO: http://jmfurlott.com/tutorial-setting-up-a-single-page-react-web-app-with-react-router-and-webpack/

console.log('loading app/js/giant.js');

define(
    [
        'jquery',
        'async'
    ],

    function ($,async) {

        window.hotReloadWithRequire = function(fileArray,callback){

            var funcs = [];

            fileArray.forEach(function(item,index){
                funcs.push(function(cb){
                    require.undef(item);
                    require([item],function(file){
                        cb(null,file);
                    });

                    //define([item],function(file){
                    //    cb(null,file);
                    //});

                });
            });

            async.parallel(funcs,function done(err,results){
                callback(err,results);
            })

        };

        window.hotReloadWithDefine = function(fileArray,callback){

            var funcs = [];

            fileArray.forEach(function(item,index){
                funcs.push(function(cb){

                    require.undef(item);
                    require.undef(String(item).substring(3));
                    //require([item],function(file){
                    //    cb(null,file);
                    //});

                    //define([item],function(file){
                    //      cb(null,file);
                    //});

                    require([item],function(file){
                        cb(null,file);
                    });

                });
            });

            async.parallel(funcs,function done(err,results){
                callback(err,results);
            })

        };

    });

