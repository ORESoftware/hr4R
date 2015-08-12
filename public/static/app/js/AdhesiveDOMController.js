/**
 * Created by amills001c on 8/11/15.
 */



define(
    [
        'backbone',
        'underscore',
        'jquery'
    ],

    function (Backbone, _, $) {


        function AdhesiveDOMController(view, opts) {
            this.view = view;
        }

        AdhesiveDOMController.prototype.updateDOMViaPlainObjectChange = function (domKeyName, domElementsToPotentiallyUpdate, obj, event) {

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
        };

        AdhesiveDOMController.prototype.updateDOMViaModelChange = function(domKeyName, model, domElementsToPotentiallyUpdate){

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

                    var modelName = split[0];
                    var modelProp = split[1];

                    //if (domKeyName == modelName && _.contains(props, modelProp)) {

                    if (domKeyName == modelName) {

                        var cid = $(self).attr('adhesive-cid');

                        if (cid && String(cid) == model.cid) {

                            var val = model.get(modelProp);
                            //$(self).html(String(prop));
                            func(self, val); //done!

                            numChanges++;

                            //if (numChanges >= maxChanges) {
                            //    exitLoop = true;
                            //    return false; //break from each loop, we are done updating DOM for this model
                            //}
                        }
                    }

                });
            });

        };

        AdhesiveDOMController.prototype.updateDOMViaCollectionChange = function(domKeyName, collection, domElement, modelCIDHash, eventName){

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
                this.view.render();
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

                    //var props = split[split.length - 1];
                    var modelName = split[0];
                    var prop = split[1];
                    //var modelProp = split.pop();
                    //var modelName = split.shift();
                    //
                    //var props = split;

                    if (domKeyName == modelName) {

                        var cid = $(self).attr('adhesive-cid');

                        if (cid) {
                            var foundModel = modelCIDHash[cid];

                            if (foundModel) {

                                var model = foundModel.model;
                                var val = model.get(prop);
                                //var props = Object.keys(foundModel.changed);

                                console.log('val:', val);
                                console.log('foundModel:', foundModel);
                                console.log('model:', model);
                                func(self, val); //done!
                                console.log('valentino');


                                //var subModel = getNestedModels(0,model,props);
                                //
                                //var valueTemp = '';
                                //
                                //if (subModel) {
                                //    if (subModel instanceof Backbone.Model) {
                                //        valueTemp= subModel.get(modelProp);
                                //    }
                                //    else {
                                //        valueTemp = subModel[modelProp];
                                //    }
                                //    func(self, prop); //done!
                                //}
                                //else{
                                //    console.error('no submodel found');
                                //}


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

        };



        return AdhesiveDOMController;

    });