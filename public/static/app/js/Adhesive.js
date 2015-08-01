/**
 * Created by amills001c on 7/23/15.
 */


//TODO: insert a new row in table without re-rendering http://stackoverflow.com/q/31665966/1223975


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
            //TODO: do we need to unbind any elements or since we are using 'this.el' Backbone might take care of this already..?
            this.jQueryBinds = [];
        }

        Adhesive.prototype.unStick = function () {
            this.stopListening();
            _.each(this.jQueryBinds, function (el, index) {
                el.unbind();
                el.off();
            });
        };

        function stick(opts) {

            //TODO: give these default values inside this class
            //limitToEventTarget: true,
            //domElementListen: self.$el,
            //domElementUpdate: $(document),

            var domKeyName = opts.keyName;
            var domElementListen = opts.domElementListen;
            var domElementUpdate = opts.domElementUpdate;
            var domEventType = opts.domEventType;
            var limitToEventTarget = opts.limitToEventTarget;
            var callback = opts.callback;

            var limitToClass = opts.limitToClass;

            this.jQueryBinds.push(domElementListen);

            var self = this;

            var plainObjects = opts.plainObjects;
            var models = opts.models;
            var collections = opts.collections;

            if (plainObjects) {

                var plainObjectsToListenTo = plainObjects.listenTo;
                var plainObjectEvents = plainObjects.events;
                var plainObjectsToUpdate = plainObjects.update;

                if (plainObjectEvents && plainObjectEvents.length > 0) {

                    plainObjectEvents = plainObjectEvents.join(' '); //separate event-names by a space
                    _.each(plainObjectsToListenTo, function (obj, index) {
                        self.listenTo(obj, plainObjectEvents, function (event) {
                            updateDOMViaPlainObjectChange(domKeyName, domElementUpdate, obj, event);
                        });
                    });

                }

                if (plainObjectsToUpdate && plainObjectsToUpdate.length > 0) {

                    if (limitToClass) {
                        domElementListen = domElementListen.find(limitToClass);
                    }
                    domElementListen.on(domEventType, function (event) { //click will only be registered in html is in DOM anyway so...assume it is there

                        event.preventDefault();

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
                var modelEvents = models.modelEvents;
                var modelsToUpdate = models.update;


                if (modelEvents && modelEvents.length > 0) {

                    modelEvents = modelEvents.join(' '); //separate event-names by a space
                    _.each(modelsToListenTo, function (model, index) {
                        self.listenTo(model, modelEvents, function (model) {
                            updateDOMViaModelChange(domKeyName, model, domElementUpdate);
                        });
                    });

                }

                if (modelsToUpdate && modelsToUpdate.length > 0) {

                    if (limitToClass) {
                        domElementListen = domElementListen.find(limitToClass);
                    }

                    domElementListen.on(domEventType, function (event) { //click will only be registered in html is in DOM anyway so...assume it is there

                        event.preventDefault();

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
                var collectionEvents = collections.collectionEvents;
                var collectionsToUpdate = collections.update;
                var filterUpdateFunction = collections.filterUpdateFunction || function () {
                        return true
                    };

                if (collectionEvents && collectionEvents.length > 0) {

                    collectionEvents = collectionEvents.join(' '); //separate event-names by a space
                    _.each(collectionsToListenTo, function (coll, index) {
                        self.listenTo(coll, collectionEvents, function (models, eventName) {
                            updateDOMViaCollectionChange(self, domKeyName, coll, domElementUpdate, models, eventName);
                        });
                    });
                }


                if (collectionsToUpdate && collectionsToUpdate.length > 0) {

                    if (limitToClass) {
                        domElementListen = domElementListen.find(limitToClass);
                    }

                    domElementListen.on(domEventType, function (event) { //click will only be registered if html is in DOM anyway so...assume it is there

                        event.preventDefault();

                        if (typeof callback === 'function') {
                            callback(event);
                        }
                        else {
                            updateBackboneCollections(domKeyName, domElementListen, collectionsToUpdate, event, limitToEventTarget, filterUpdateFunction);
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

                        //if (domKeyName == modelName && _.contains(props, modelProp)) {

                        if (domKeyName == modelName) {

                            var cid = $(self).attr('adhesive-cid');

                            if (cid && String(cid) == model.cid) {

                                var prop = model.get(modelProp);
                                $(self).html(String(prop));

                                numChanges++;

                                //if (numChanges >= maxChanges) {
                                //    exitLoop = true;
                                //    return false; //break from each loop, we are done updating DOM for this model
                                //}
                            }
                        }
                    }
                });
            });
        }


        function updateDOMViaCollectionChange(self, domKeyName, collection, domElement, modelCIDHash, eventName) {

            console.log('update-DOM-Via-Collection-Change:', domElement, 'models changed:', modelCIDHash);

            //if (!document.contains(domElement)) {
            //    console.log('visible document does not contain element, so why update it');
            //    return;
            //} //TODO: listeners should be removed once the view is removed

            //var props = Object.keys(changes);
            //var maxChanges = Object.keys(changes).length;

            //var maxChanges = models.length;

            if (eventName === 'coll-add') {
                //if we add a model to a collection, for now we just re-render the view, it's just way easier
                //later on we can use jQuery to add a row to a table instead of just re-rendering the entire view
                self.view.render();
                return;
            }


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

                    var func = null;

                    switch (name) {
                        case 'adhesive-value':
                            func = function (element, val) {
                                $(element).html(String(val));
                            };
                            break;
                        case 'adhesive-value-checkbox':
                            func = function (element, val) {
                                $(element).prop('checked', val);
                            };
                            break;
                        default:
                            return true; //could be return false if 'adhesive-get' was always first attribute
                    }

                    var split = String(value).split(':');

                    var prop = split[split.length - 1];
                    var modelProp = split.pop();
                    var modelName = split.shift();

                    var props = split;

                    if (domKeyName == modelName) {

                        var cid = $(self).attr('adhesive-cid');

                        if (cid) {
                            var foundModel = modelCIDHash[cid];

                            if (foundModel) {

                                var model = foundModel.model;
                                //var props = Object.keys(foundModel.changed);

                                var subModel = getNestedModels(0,model,props);

                                var valueTemp = '';

                                if (subModel) {
                                    if (subModel instanceof Backbone.Model) {
                                        valueTemp= subModel.get(modelProp);
                                    }
                                    else {
                                        valueTemp = subModel[modelProp];
                                    }
                                    func(self, prop); //done!
                                }
                                else{
                                    console.error('no submodel found');
                                }


                                //numChanges++;
                                //if (numChanges >= maxChanges) {
                                //    exitLoop = true;
                                //    return false; //break from each loop, we are done updating DOM for this model
                                //}
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
                            model.set(modelProp, val, {localChange: true});
                            model.persistModel();
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
                        case 'adhesive-get-checkbox':
                            func = function (element) {
                                //return $(element).text();
                                return $(element).is(':checked');
                            };
                            break;
                        default:
                            return true; //could be return false if 'adhesive-get' was always first attribute
                    }

                    var split = String(value).split(':');

                    //var modelName = split[0];
                    //var modelProp = split[1];

                    var prop = split[split.length - 1];
                    var modelProp = split.pop();
                    var modelName = split.shift();

                    var props = split;

                    if (domKeyName == modelName) {

                        var val = func(element);

                        _.each(collections, function (coll, index) {

                            //TODO instead of always filtering, filter conditionally only if there is a filter function,
                            // TODO: have to deal with filter returning a plain array instead of Backbone collections

                            coll = coll.filter(filterFunction);

                            //coll.each(function (model) {
                            _.each(coll, function (model, index) {

                                var subModel = getNestedModels(0, model, props);

                                if (subModel) {
                                    if (subModel instanceof Backbone.Model) {
                                        subModel.set(modelProp, val, {localChange: true});
                                    }
                                    else {
                                        subModel[modelProp] = val;
                                        model.trigger('model-local-change-broadcast', model);
                                    }
                                    model.persistModel();
                                }
                                else{
                                    console.error('no submodel found');
                                }
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


        function getNestedModels(index, model, props) {

            var temp = null;
            if (props[index]) {
                temp = model.get(props[index]);

                ++index;
                if (props[index]) {
                    getNestedModels(index, temp, props);
                }
                else {
                    return temp;
                }
            }
            else {
                return model;
            }
        }


        return Adhesive;
    }
);