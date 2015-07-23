/**
 * Created by amills001c on 7/22/15.
 */

//TODO: http://wmdmark.github.io/backbone-rivets-example/
//TODO: https://github.com/wmdmark/backbone-rivets-example/blob/master/tutorial.md
//TODO: https://github.com/azproduction/rivets-backbone-adapter
//TODO: http://www.gianlucaguarini.com/blog/rivet-js-backbone-js-made-my-code-awesome/

/*
 * The : in between the model and the attribute tells Rivets to use our Backbone adaptor we defined above.
 *
 *
 * To sum things up, there would now be 3 main concepts for tuning Rivets.js to your application.

 Interfaces: Defines how Rivets.js observes and interacts with the model / keypath.
 Binders: Defines how Rivets.js affects the DOM and/or model when properties change.
 Formatters: Defines how Rivets.js affects incoming values before it goes through the binder and/or back to the model.
 All of which are accessible in the universal syntax for binding declarations:

 data-[prefix]-[binder]="[model][interface][keypath] < [dependencies] | [formatters]"


 * */

define(
    [
        'rivets',
        'backbone'
    ],

    function (Rivets, Backbone) {

        // Rivets.js Backbone adapter
        var adapter = Rivets.adapters[':'] = {
            // set the listeners to update the corresponding DOM element
            observe: function (obj, keypath, callback) {
                if (obj instanceof Backbone.Collection) {
                    obj.on('add remove reset', callback);
                }
                else if (obj instanceof Backbone.Model) {
                    obj.on('change:' + keypath, callback);
                }
                else {
                    throw new Error('Rivets error: not backbone model or collection');
                }
            },
            // this will be triggered to unbind the Rivets.js events
            unobserve: function (obj, keypath, callback) {
                if (obj instanceof Backbone.Collection) {
                    obj.off('add remove reset', callback);
                }
                else if (obj instanceof Backbone.Model) {
                    obj.off('change:' + keypath, callback);
                }
                else {
                    throw new Error('Rivets error: not backbone model or collection');
                }
            },
            // define how Rivets.js should read the property from our objects
            get: function (obj, keypath) {
                // if we use a collection we will loop through its models otherwise we just get the model properties
                //TODO: @rhodee As of 0.3.2 there is a data-each-[item] binding to iterate over items in an array.
                if( obj instanceof Backbone.Collection){
                    return obj.models
                }
                else if(obj instanceof Backbone.Model){
                    return obj.get(keypath);
                }
                else{
                    throw new Error('Rivets error: not backbone model or collection');
                }
            },
            // It gets triggered whenever we want update a model using Rivets.js
            set: function (obj, keypath, value) {
                obj.set(keypath, value);
            }
        };

        return adapter;

    });