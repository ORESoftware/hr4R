/**
 * Created by amills001c on 6/9/15.
 */



console.log('loading app/js/APP.js');

window.appGlobal = {

//unfortunately, can't really avoid global variables,
// because templates need to access certain variables without have to re-inject variable values into templates

    authorized: null,  //boolean
    currentUser: null, //Backbone.Model
    env: null    //object

};


window.no_op = function(){};
window.no_op_err = function(){throw new Error('this no_op function should not have been called.')};



define(['handlebars', 'backbone','ijson','app/js/collections'], function (Handlebars, Backbone, IJSON,collections) {

    //window.onbeforeunload = function() {  //user confirms he wants to leave page
    //
    //    Object.keys(collections).forEach(function(key){
    //        if (collections.hasOwnProperty(key)) {
    //
    //                var coll = collections[key];
    //                coll.persist(function (err, res) {
    //                    if(err){
    //                        console.log(err);
    //                    }
    //                });
    //        }
    //    });
    //
    //
    //    return "Dude, are you sure you want to leave? Think of the kittens!";
    //
    //};

    //var x = IJSON.parse({});
    //
    //console.log(x);

    //Backbone.Events.listenTo({},'event1',function(msg){
    //    console.log(msg);
    //});

    //Backbone.Events.on('event1',function(msg){
    //    alert(msg);
    //});
    //
    //Backbone.Events.trigger('event1','hiiii');

    var start = function () {

        require(['app/js/boot'], function (boot) {
            boot.initialize();
        });
    };

    return {
        start: start
    };
});