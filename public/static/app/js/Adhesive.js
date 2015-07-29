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
                    self.listenTo(model, modelEvent, function (model) {
                        //if(!event._changing){
                        updateDOMViaModelChange(domKeyName, model, domElementUpdate, model.changed);
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
                var filterFunction = collections.filter || function(){return true};


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
                        updateBackboneCollections(domKeyName, domElementListen, collectionsToUpdate, event, limitToEventTarget, filterFunction);
                    }
                });
            }

            return this;
        }


        function updateDOMViaModelChange(domKeyName, model, domElement, changes) {

            console.log('update-DOM-Via-Model-Change:', domElement, changes);

            //TODO: this function won't get called once the listeners are removed, so no need to check if this is still in the DOM

            var props = Object.keys(changes);
            var maxChanges = Object.keys(changes).length;
            var exitLoop = false;
            var numChanges = 0;

            domElement.find('*').each(function () {

                if (exitLoop) {
                    return false;
                }

                var self = this;

                $.each(this.attributes, function (i, attrib) {
                    var name = attrib.name;
                    var value = attrib.value;

                    if (name === 'adhesive-value') {

                        var split = String(value).split(':');

                        var modelName = split[0];
                        var modelProp = split[1];

                        if (domKeyName == modelName && _.contains(props, modelProp)) {

                            var cid = $(self).attr('adhesive-cid');

                            if (cid && String(cid) == model.cid) {

                                var prop = model.get(modelProp);
                                $(self).html(String(prop));

                                numChanges++;

                                if (numChanges >= maxChanges) {
                                    exitLoop = true;
                                    return false; //break from each loop, we are done updating DOM for this model
                                }
                            }
                        }
                    }
                });
            });
        }


        function updateDOMViaCollectionChange(domKeyName, collection, domElement, model, changes) {

            console.log('update-DOM-Via-Collection-Change:', domElement, 'model:', model, 'changes:', changes);

            //TODO: this function should be combined with the ModelChange function

            //if (!document.contains(domElement)) {
            //    console.log('visible document does not contain element, so why update it');
            //    return;
            //} //TODO: listeners should be removed once the view is removed

            var props = Object.keys(changes);
            var maxChanges = Object.keys(changes).length;
            var exitLoop = false;
            var numChanges = 0;

            domElement.find('*').each(function () {

                if (exitLoop) {
                    return false;
                }

                var self = this;

                $.each(this.attributes, function (i, attrib) {
                    var name = attrib.name;
                    var value = attrib.value;

                    if (name === 'adhesive-value') {

                        var split = String(value).split(':');

                        var modelName = split[0];
                        var modelProp = split[1];

                        if (domKeyName == modelName && _.contains(props, modelProp)) {

                            var cid = $(self).attr('adhesive-cid');

                            if (cid && String(cid) == model.cid) {

                                var prop = model.get(modelProp);
                                $(self).html(String(prop));
                                numChanges++;

                                if (numChanges >= maxChanges) {
                                    exitLoop = true;
                                    return false; //break from each loop, we are done updating DOM for this model
                                }
                            }
                        }
                    }
                });
            });
        }


        function updateBackboneModels(domKeyName, domElement, models, event, limitToEventTarget) {

            console.log('update-Backbone-Models:', models, event);

            if (limitToEventTarget) { //we only get info from the one target element clicked or keyed

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
                        default:
                            return true;
                    }

                    //var str = String(domKeyName).concat(':');

                    var split = String(value).split(':');

                    var modelName = split[0];
                    var modelProp = split[1];

                    if (domKeyName == modelName) {

                        //TODO: don't need to check CID because we might be updating multiple models from the same element?
                        var val = func(element);

                        _.each(models, function (model, index) {
                            model.set(modelProp, val);
                            model.save();
                            console.log('backbone model property:', modelProp, 'set to:', val);
                        });
                    }

                });

            }
            else {


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
                            default:
                                return true; //could be return false if 'adhesive-get' was always first attribute
                        }

                        var split = String(value).split(':');

                        var modelName = split[0];
                        var modelProp = split[1];

                        if (domKeyName == modelName) {

                            var val = func(self);

                            _.each(models, function (model, index) {
                                model.set(modelProp, val);
                                model.save();
                                console.log('backbone model property:', modelProp, 'set to:', val);
                            });
                        }
                    });
                });
            }
        }


        function updateBackboneCollections(domKeyName, domElement, collections, event, limitToEventTarget, filterFunction) {

            console.log('update-Backbone-Collections:', collections, event);

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
                                //return $(element).text();
                                return $(element).val();
                            };
                            break;
                        default:
                            return true; //could be return false if 'adhesive-get' was always first attribute
                    }

                    var split = String(value).split(':');

                    var modelName = split[0];
                    var modelProp = split[1];

                    if (domKeyName == modelName) {

                        var val = func(element);

                        _.each(collections, function (coll, index) {

                            coll = coll.filter(filterFunction);

                            //coll.each(function (model) {
                            _.each(coll,function (model,index) {
                                model.set(modelProp, val);
                                model.save();
                                console.log('backbone model property:', modelProp, 'set to:', val);
                            })
                        });
                    }
                });
            }
            else {

                domElement.find('*').each(function () {

                    var self = this;

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
                            default:
                                return true; //could be return false if 'adhesive-get' was always first attribute
                        }

                        var split = String(value).split(':');

                        var modelName = split[0];
                        var modelProp = split[1];

                        if (domKeyName == modelName) {

                            var val = func(self);

                            _.each(collections, function (coll, index) {

                                coll = coll.filter(filterFunction);

                                coll.each(function (model) {
                                    model.set(modelProp, val);
                                    model.save();
                                    console.log('backbone model property:', modelProp, 'set to:', val);
                                })
                            });
                        }

                    });
                });
            }
        }


        return Adhesive;
    }
);