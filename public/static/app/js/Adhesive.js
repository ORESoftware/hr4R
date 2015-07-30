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
            this.stick = stick.bind(this);
            this.jQueryBinds = []; //TODO: do we need to unbind any elements or since we are using 'this.el' Backbone might take care of this already..?
        }

        Adhesive.prototype.unStick = function () {
            this.stopListening();
            _.each(this.jQueryBinds, function (el, index) {
                el.unbind();
                el.off();
            });
        };

        function stick(opts) {

            var domKeyName = opts.keyName;
            var domElementListen = opts.domElementListen;
            var domElementUpdate = opts.domElementUpdate;
            var domEventType = opts.domEventType;
            var limitToEventTarget = opts.limitToEventTarget;
            var callback = opts.callback;

            this.jQueryBinds.push(domElementListen);

            var self = this;

            var plainObjects = opts.plainObjects;
            var models = opts.models;
            var collections = opts.collections;

            if (plainObjects) {

                var plainObjectsToListenTo = plainObjects.listenTo;
                var plainObjectEvents = plainObjects.events;
                var plainObjectsToUpdate = plainObjects.update;

                plainObjectEvents = plainObjectEvents.join(' '); //separate event-names by a space

                _.each(plainObjectsToListenTo, function (obj, index) {
                    self.listenTo(obj, plainObjectEvents, function (event) {
                        updateDOMViaPlainObjectChange(domKeyName, domElementUpdate, obj, event);
                    });
                });

                if (plainObjectsToUpdate && plainObjectsToUpdate.length > 0) {
                    domElementListen.on(domEventType, function (event) { //click will only be registered in html is in DOM anyway so...assume it is there
                        //event.preventDefault();

                        if (typeof callback === 'function') {
                            callback(event);
                        }
                        else {
                            updatePlainObjects(domKeyName, domElementListen, plainObjectsToUpdate, event, limitToEventTarget);
                        }
                    });
                }
            }

            if (models) {

                var modelsToListenTo = models.listenTo;
                var modelEvent = models.modelEvent;
                var modelsToUpdate = models.update;

                _.each(modelsToListenTo, function (model, index) {
                    self.listenTo(model, modelEvent, function (model) {
                        updateDOMViaModelChange(domKeyName, model, domElementUpdate);
                    });
                });


                if (modelsToUpdate && modelsToUpdate.length > 0) {
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

            }


            if (collections) {

                var collectionsToListenTo = collections.listenTo;
                var collectionEvent = collections.collectionEvent;
                var collectionsToUpdate = collections.update;
                var filterFunction = collections.filterUpdate || function () {
                        return true
                    };


                _.each(collectionsToListenTo, function (coll, index) {
                    //self.listenTo(coll, collectionEvent, function (model, changes) {
                    self.listenTo(coll, collectionEvent, function (models) {
                        updateDOMViaCollectionChange(domKeyName, coll, domElementUpdate, models);
                    });
                });

                if (collectionsToUpdate && collectionsToUpdate.length > 0) {
                    domElementListen.on(domEventType, function (event) { //click will only be registered if html is in DOM anyway so...assume it is there

                        //event.preventDefault();
                        if (typeof callback === 'function') {
                            callback(event);
                        }
                        else {
                            updateBackboneCollections(domKeyName, domElementListen, collectionsToUpdate, event, limitToEventTarget, filterFunction);
                        }
                    });
                }
            }

            return this;
        }

        function updateDOMViaPlainObjectChange(domKeyName, domElementsToPotentiallyUpdate, obj, event) {

            domElementsToPotentiallyUpdate.find('*').each(function () {

                var self = this;
                var attributes = self.attributes;

                $.each(attributes, function (i, attrib) {
                    var name = attrib.name;
                    var value = attrib.value;

                    if (name === 'adhesive-value') {

                        var split = String(value).split(':');

                        var modelName = split[0];
                        var modelProp = split[1];

                        if (domKeyName == modelName) {

                            //var prop = obj[modelProp];
                            var prop = event;
                            $(self).html(String(prop));

                        }
                    }
                });
            });

        }

        function updatePlainObjects(domKeyName, domElementListen, plainObjectsToUpdate, event, limitToEventTarget) {

            throw new Error('shouldnt happen yet!!');

        }


        function updateDOMViaModelChange(domKeyName, model, domElementsToPotentiallyUpdate) {

            console.log('update-DOM-Via-Model-Change:', domElementsToPotentiallyUpdate, 'changes:', model.changed);

            //TODO: this function won't get called once the listeners are removed, so no need to check if this is still in the DOM

            var changes = model.changed;
            var props = Object.keys(changes);
            var maxChanges = Object.keys(changes).length;
            var exitLoop = false;
            var numChanges = 0;

            domElementsToPotentiallyUpdate.find('*').each(function () {

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


        function updateDOMViaCollectionChange(domKeyName, collection, domElement, modelCIDHash) {

            console.log('update-DOM-Via-Collection-Change:', domElement, 'models changed:', modelCIDHash);

            //if (!document.contains(domElement)) {
            //    console.log('visible document does not contain element, so why update it');
            //    return;
            //} //TODO: listeners should be removed once the view is removed

            //var props = Object.keys(changes);
            //var maxChanges = Object.keys(changes).length;

            //var maxChanges = models.length;
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

                        if (domKeyName == modelName) {

                            var cid = $(self).attr('adhesive-cid');

                            //var foundModel = _.find(models,function(model){
                            //    return model.cid == cid;
                            //});
                            if (cid) {
                                var foundModel = modelCIDHash[cid];

                                if (foundModel) {

                                    var model = foundModel.model;
                                    var props = Object.keys(foundModel.changed);

                                    //if(_.contains(props, modelProp)){
                                    var prop = model.get(modelProp) || '';

                                    $(self).html(String(prop));
                                    //numChanges++;

                                    //if (numChanges >= maxChanges) {
                                    //    exitLoop = true;
                                    //    return false; //break from each loop, we are done updating DOM for this model
                                    //}
                                    //}
                                }
                            }
                        }
                    }
                });
            });
        }


        function updateBackboneModels(domKeyName, domElement, models, event, limitToEventTarget) {

            console.log('update-Backbone-Models:', models, event);


            function iterateOverAttributes(element, attributes) {

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

            if (limitToEventTarget) { //we only get info from the one target element clicked or keyed

                var element = event.target;
                var attributes = element.attributes;

                iterateOverAttributes(element, attributes);
            }
            else {

                domElement.find('*').each(function () {

                    var element = this;
                    var attributes = element.attributes;

                    var result = iterateOverAttributes(element, attributes);

                    //check result to stop looping
                });
            }
        }


        function updateBackboneCollections(domKeyName, domElement, collections, event, limitToEventTarget, filterFunction) {

            console.log('update-Backbone-Collections:', collections, event);


            function iterateOverAttributes(element, attributes) {

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
                            _.each(coll, function (model, index) {
                                model.set(modelProp, val);
                                model.save();
                                console.log('backbone model property:', modelProp, 'set to:', val);
                            })
                        });
                    }
                });

            }

            if (limitToEventTarget) {

                var element = event.target;
                var attributes = element.attributes;

                iterateOverAttributes(element, attributes);
            }
            else {

                domElement.find('*').each(function () {

                    var element = this;
                    var attributes = element.attributes;

                    iterateOverAttributes(element, attributes);
                });
            }
        }


        return Adhesive;
    }
);