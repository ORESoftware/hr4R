/**
 * Created by amills001c on 7/23/15.
 */



define(
    [
        'backbone',
        'underscore',
        'jquery'
    ],

    function (Backbone, _, $) {


        function Adhesive(view, opts) {
            this.view = view;
            _.extend(this, Backbone.Events);
            this.bind = bind.bind(this); //just to f*$k with you, this format is needed in order to debug with Mozilla
            this.jQueryBinds = []; //TODO: do we need to unbind any elements or since we are using 'this.el' Backbone might take care of this already..?
        }

        Adhesive.prototype.unStick = function () {
            this.stopListening();
            _.each(this.jQueryBinds, function (el, index) {
                el.unbind();
                el.off();
            });
        };

        function bind(opts) {

            var domKeyName = opts.keyName;
            var domElementListen = opts.domElementListen;
            var domElementUpdate = opts.domElementUpdate;
            var domEventType = opts.domEventType;
            var limitToEventTarget = opts.limitToEventTarget;
            var callback = opts.callback;

            this.jQueryBinds.push(domElementListen);

            var self = this;


            var models = opts.models;

            if (models) {

                var modelsToListenTo = models.listenTo;
                var modelEvent = models.modelEvent;
                var modelsToUpdate = models.update;

                _.each(modelsToListenTo, function (model, index) {
                    self.listenTo(model, modelEvent, function (event) {
                        //if(!event._changing){
                        updateDOMViaModelChange(domKeyName, model, domElementUpdate, event);
                        //}
                    });
                });


                domElementListen.on(domEventType, function (event) { //click will only be registered in html is in DOM anyway so...assume it is there
                    //event.preventDefault();

                    if (typeof callback === 'function') {
                        callback(event);
                    }
                    else {
                        updateBackboneModels(domKeyName, domElementListen, modelsToUpdate, event, limitToEventTarget);
                    }
                });
            }

            var collections = opts.collections;

            if (collections) {

                var collectionsToListenTo = collections.listenTo;
                var collectionEvent = collections.collectionEvent;
                var collectionsToUpdate = collections.update;


                _.each(collectionsToListenTo, function (coll, index) {
                    self.listenTo(coll, collectionEvent, function (model, changes) {
                        updateDOMViaCollectionChange(domKeyName, coll, domElementUpdate, model, changes);
                    });
                });

                domElementListen.on(domEventType, function (event) { //click will only be registered in html is in DOM anyway so...assume it is there

                    //event.preventDefault();
                    if (typeof callback === 'function') {
                        callback(event);
                    }
                    else {
                        //updateBackboneCollections(domKeyName, domElementListen, collectionsToUpdate, event, limitToEventTarget);
                    }
                });
            }

            return this;
        }


        function updateDOMViaModelChange(domKeyName, model, domElement, event) {

            console.log('update-DOM-Via-Model-Change:', domElement, event);

            //TODO: this function won't get called once the listeners are removed, so no need to check if this is still in the DOM

            domElement.find('*').each(function () {

                var self = this;
                $.each(this.attributes, function (i, attrib) {
                    var name = attrib.name;
                    var value = attrib.value;

                    if (name === 'adhesive-value') {

                        var str = String(domKeyName).concat(':');

                        if (String(value).startsWith(str)) {

                            var propName = String(value).substring(str.length);
                            var prop = model.get(propName);
                            $(self).html(String(prop));

                        }
                    }
                });
            });
        }


        function updateDOMViaCollectionChange(domKeyName, collection, domElement, model, changes) {

            console.log('update-DOM-Via-Collection-Change:', domElement, 'model:', model, 'changes:', changes);

            //if (!document.contains(domElement)) {
            //    console.log('visible document does not contain element, so why update it');
            //    return;
            //}

            domElement.find('*').each(function () {

                var self = this;
                $.each(this.attributes, function (i, attrib) {
                    var name = attrib.name;
                    var value = attrib.value;

                    if (name === 'adhesive-value') {

                        var str = String(domKeyName).concat(':');

                        if (String(value).startsWith(str)) {

                            var propName = String(value).substring(str.length);
                            var prop = model.get(propName);
                            $(self).html(String(prop));

                        }
                    }
                });
            });
        }


        function updateBackboneModels(domKeyName, domElement, models, event, limitToEventTarget) {

            console.log('update-Backbone-Models:', models, event);

            if (limitToEventTarget) {

                var element = event.target;
                var attributes = element.attributes;

                $.each(attributes, function (i, attrib) {
                    var name = attrib.name;
                    var value = attrib.value;

                    var func = null;

                    switch (name) {
                        case 'adhesive-get':
                            func = function (element) {
                                return $(element).val();
                            };
                            break;
                        case 'fart':
                            break;
                        default:
                            return true;
                    }

                    var str = String(domKeyName).concat(':');

                    if (String(value).startsWith(str)) {
                        var propName = String(value).substring(str.length);
                        var val = func(element);

                        _.each(models, function (model, index) {
                            model.set(propName, val);
                            console.log('backbone model property:', propName, 'set to:', val);
                        });
                    }

                });

            } else {


                domElement.find('*').each(function () {

                    var self = this;
                    var attributes = self.attributes;

                    $.each(this.attributes, function (i, attrib) {
                        var name = attrib.name;
                        var value = attrib.value;

                        var func = null;

                        switch (name) {
                            case 'adhesive-get':
                                func = function (element) {
                                    return $(element).text();
                                };
                                break;
                            case 'fart':
                                break;
                            default:
                                return true;
                        }

                        var str = String(domKeyName).concat(':');

                        if (String(value).startsWith(str)) {
                            var propName = String(value).substring(str.length);
                            var val = func(self);

                            _.each(models, function (model, index) {
                                model.set(propName, val);
                                console.log('backbone model property:', propName, 'set to:', val);
                            });
                        }

                    });
                });
            }
        }


        function updateBackboneCollections(domKeyName, domElement, collections, event, limitToEventTarget) {

            console.log('updateBackboneModel:', collections, event);

            if(limitToEventTarget){

                var element = event.target;
                var attributes = element.attributes;

                $.each(attributes, function (i, attrib) {
                    var name = attrib.name;
                    var value = attrib.value;

                    if (name === 'adhesive-get') {

                        var str = String(domKeyName).concat(':');

                        if (String(value).startsWith(str)) {
                            var propName = String(value).substring(str.length);
                            var val = self.value;

                            _.each(collections, function (coll, index) {
                                coll.each(function (model) {
                                    model.set(propName, val);
                                    console.log('backbone model property:', propName, 'set to:', val);
                                })
                            });
                        }
                    }
                });
            }
            else {


                domElement.find('*').each(function () {

                    var self = this;

                    $.each(this.attributes, function (i, attrib) {
                        var name = attrib.name;
                        var value = attrib.value;

                        if (name === 'adhesive-get') {

                            var str = String(domKeyName).concat(':');

                            if (String(value).startsWith(str)) {
                                var propName = String(value).substring(str.length);
                                var val = self.value;

                                _.each(collections, function (coll, index) {
                                    coll.each(function (model) {
                                        model.set(propName, val);
                                        console.log('backbone model property:', propName, 'set to:', val);
                                    })
                                });
                            }
                        }
                    });
                });
            }
        }


        return Adhesive;
    }
);