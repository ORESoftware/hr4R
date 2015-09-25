/**
 * Created by denmanm1 on 8/11/15.
 */


define(
    [
        'underscore'
    ],

    function (_) {


        function findFunctionHelper(name) {

            switch (name) {
                case 'adhesive-get':
                    return function (element) {
                        //return $(element).text();
                        return $(element).val();
                    };
                    break;
                case 'adhesive-get-checkbox':
                    return function (element) {
                        return ($(element).is(':checked'));
                    };
                    break;
                default:
                    return null;
            }

        }

        function AdhesiveStateController() {

        }

        AdhesiveStateController.prototype.updatePlainObjects = function (domKeyName, domElementListen, plainObjectsToUpdate, event, limitToEventTarget) {
            throw new Error('shouldnt happen yet!!');
        };

        AdhesiveStateController.prototype.updateBackboneModels = function (domKeyName, domElement, models, event, limitToEventTarget) {

            console.log('update-Backbone-Models:', models, event);


            function iterateOverAttributes(element, attributes) {

                $.each(attributes, function (i, attrib) {

                    var name = attrib.name;
                    var value = attrib.value;

                    if (value.indexOf(domKeyName) === 0) {

                        var func = findFunctionHelper(name);

                        if (func == null) {
                            return true;
                        }

                        var propsArray = String(value).split(':');
                        var modelName = propsArray.shift();
                        var modelProp = propsArray.shift();
                        var nestedAttribs = propsArray.join('.');


                        //TODO: don't need to check CID because we might be updating multiple models from the same element?
                        var val = func(element);

                        _.each(models, function (model, index) {
                            if (nestedAttribs.length > 0) {
                                model.setNestedAttrForChange(modelProp, nestedAttribs, val, {localChange: true});
                            }
                            else {
                                model.set(modelProp, val, {localChange: true});
                            }
                            model.persistModel();
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

                    //TODO: check result to stop looping
                });
            }
        };


        AdhesiveStateController.prototype.updateBackboneCollections = function (domKeyName, domElement, collections, event, limitToEventTarget, filterFunction) {

            console.log('update-Backbone-Collections:', collections, event);


            function iterateOverAttributes(element, attributes) {

                $.each(attributes, function (i, attrib) {
                    var name = attrib.name;
                    var value = attrib.value;

                    var func = findFunctionHelper(name);

                    if (func == null) {
                        return true;
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