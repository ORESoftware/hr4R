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


        //TODO: recursion is even harder in JS due to closures

       /* function getNestedModels(value, index, model, props) {

            var temp = value;
            var value = model;
            if (props[index]) {
                temp = model.get(props[index]);

                ++index;
                if (props[index]) {
                    getNestedModels(temp, index, temp, props);
                }
                else {
                    return temp;
                }
            }
            else {
                return value;
            }
        }*/


        function AdhesiveStateController(view, opts) {
            this.view = view;

        }

        AdhesiveStateController.prototype.updatePlainObjects = function (domKeyName, domElementListen, plainObjectsToUpdate, event, limitToEventTarget) {

            throw new Error('shouldnt happen yet!!');


        };

        AdhesiveStateController.prototype.updateBackboneModels = function(domKeyName, domElement, models, event, limitToEventTarget){

            console.log('update-Backbone-Models:', models, event);


            function iterateOverAttributes(element, attributes) {

                $.each(attributes, function (i, attrib) {

                    if(!attrib){
                        console.log('wtf no attrib defined');
                        return false;
                    }
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
                                var boolean = ($(element).is(':checked'));
                                $(element).prop('checked', boolean);
                                return boolean;
                            };
                            break;
                        default:
                            return true;
                    }

                    var split = String(value).split(':');

                    //var modelName = split[0];
                    //var modelProp = split[1];

                    var modelName = split.shift();
                    var modelProp = split.shift();

                    var nestedModels = split.join('.');


                    //if (domKeyName == modelName) {

                    if (value.indexOf(domKeyName) ===0) {

                        //TODO: don't need to check CID because we might be updating multiple models from the same element?
                        var val = func(element);

                        _.each(models, function (model, index) {
                            if(nestedModels.length > 0){
                                model.setNestedAttrForChange(modelProp,nestedModels, val, {localChange:true});
                            }
                            else{
                                model.set(modelProp, val, {localChange: true});
                            }
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

                //TODO: find ('my custom tag') or elements with a certain .class instead of find('*')

                domElement.find('*').each(function () {

                    var element = this;
                    var attributes = element.attributes;

                    var result = iterateOverAttributes(element, attributes);

                    //check result to stop looping
                });
            }
        };


        AdhesiveStateController.prototype.updateBackboneCollections = function (domKeyName, domElement, collections, event, limitToEventTarget, filterFunction) {

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
                                return ($(element).is(':checked'));
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

                                //var subModel = getNestedModels(null,0, model, props);
                                //
                                //if (subModel) {
                                //    if (subModel instanceof Backbone.Model) {
                                //        subModel.set(modelProp, val, {localChange: true});
                                //    }
                                //    else {
                                //        subModel[modelProp] = val;
                                //        model.trigger('model-local-change-broadcast', model);
                                //    }
                                //    model.persistModel();
                                //}
                                //else{
                                //    console.error('no submodel found');
                                //}

                                var attributes = {};
                                attributes[modelProp] = val;
                                //model.set(modelProp,val);
                                //TODO: need to set attributes before saving to server, otherwise if server fails, then what? we want optimistic changes in place
                                model.persistModel(attributes);
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


        };


        return AdhesiveStateController;

    });