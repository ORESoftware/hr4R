/**
 * Created by denman on 8/8/2015.
 */


/**
 * Created by amills001c on 6/9/15.
 */


console.log('loading app/js/ModelCollectionMediator.js');

//TODO: In model, urlRoot is used for the Model. url is used for the instance of the Model.
//TODO: http://beletsky.net/2012/11/baby-steps-to-backbonejs-model.html
//TODO: http://christianalfoni.github.io/javascript/2014/10/22/nailing-that-validation-with-reactjs.html

define(function (require) {

        return {
            findCollectionByName: function(name){
                return require('#allCollections')[name];
            }
        };

    });

/*
//Inside b.js:
define(["require", "a"],
    function(require, a) {
        //"a" in this case will be null if "a" also asked for "b",
        //a circular dependency.
        return function(title) {
            return require("a").doSomething();
        }
    }
);*/
