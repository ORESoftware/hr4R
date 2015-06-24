/**
 * Created by amills001c on 6/9/15.
 */



console.log('loading app/js/APP.js');

appGlobal = {

//unfortunately, can't really avoid global variables,
// because templates need to access certain variables without have to re-inject variable values into templates

    authorized: null,
    currentUser: null,
    env: null

};


define(['handlebars', 'backbone','ijson'], function (Handlebars, Backbone, IJSON) {

    //window.onbeforeunload = function() {  //user confirms he wants to leave page
    //    return "Dude, are you sure you want to leave? Think of the kittens!";
    // TODO: save all collections here before popping the question
    //};

    var x = IJSON.parse({});

    console.log(x);

    var start = function () {

        require(['app/js/boot'], function (boot) {
            boot.initialize();
        });
    };

    return {
        start: start
    };
});