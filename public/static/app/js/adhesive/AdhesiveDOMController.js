/**
 * Created by amills001c on 8/11/15.
 */



define(
    [
        'underscore',
        'util(NPM)'
    ],

    function (_, util) {

        function compareChanges(domKeyName,value,changes) {

            //domKeyName = job:verified
            //value = job:verified
            //change = verified

            for(var key in changes){
                if(changes.hasOwnProperty(key)){
                    //if(String(value).indexOf(domKeyName+':'+key) === 0){
                    if(String(value).indexOf(domKeyName) === 0){
                        return true;
                    }
                }
            }
        }


        function findFunctionHelper(name) {

            switch (name) {
                case 'adhesive-value':
                    return function (element, val) {
                        $(element).html(String(val));
                    };
                case 'adhesive-value-checkbox':
                    return function (element, val) {
                        $(element).prop('checked', val);
                    };
                default:
                    return null;
            }

        }


        function AdhesiveDOMController() {

        }

        AdhesiveDOMController.prototype.updateDOMViaPlainObjectChange = function (domKeyName, domElementsToPotentiallyUpdate, obj, eventName, eventObj) {

            domElementsToPotentiallyUpdate.find('*').each(function () {

                var self = this;
                var attributes = self.attributes;

                $.each(attributes, function (i, attrib) {

                    var name = attrib.name;
                    var value = attrib.value;

                    var func = findFunctionHelper(name);

                    if (!func) {
                        return true;
                    }

                    var propsArray = String(value).split(':');

                    var modelName = propsArray.shift();
                    var modelProp = propsArray.shift();
                    var nestedProps = propsArray.join('.');

                    if (value.indexOf(domKeyName) === 0) {

                        var val = _.result(eventObj, modelProp);
                        if (val == null) {
                            val = util.inspect(eventObj);
                        }
                        else if (nestedProps.length > 0) {
                            val = eval('val.' + nestedProps);
                        }

                        func(self, val); //done!
                        //nothing here, just padding for Firefox debugger
                    }

                });
            });
        };

        AdhesiveDOMController.prototype.updateDOMViaModelChange = function (domKeyName, model, domElementsToPotentiallyUpdate) {

            //TODO: this function won't get called once the listeners are removed, so no need to check if this is still in the DOM

            var changes = model.changed;
            var maxChanges = Object.keys(changes).length;
            var exitLoop = false;
            var numChanges = 0;


            domElementsToPotentiallyUpdate.find('*').each(function () {

                    if (exitLoop) {
                        return false;
                    }

                    var self = this;

                    $.each(self.attributes, function (i, attrib) {

                        var name = attrib.name;
                        var value = attrib.value;

                        if (value.indexOf(domKeyName) === 0 && compareChanges(domKeyName,value,changes)) {

                            var func = findFunctionHelper(name);

                            if (func == null) {
                                return true;
                            }

                            var propsArray = String(value).split(':');
                            var modelName = propsArray.shift();
                            var modelProp = propsArray.shift();

                            var nestedProps = propsArray.join('.');


                            var cid = $(self).attr('adhesive-cid');

                            if (cid == null || String(cid) == String(model.cid)) {

                                var val = model.get(modelProp);

                                if (val == null) {
                                    val = util.inspect(model.attributes);
                                }
                                else if (nestedProps.length > 0) {
                                    val = eval('val.' + nestedProps);
                                }

                                if (typeof val === 'object') {
                                    val = util.inspect(val);
                                }

                                func(self, val); //done!

                                numChanges++;

                                //if (numChanges >= maxChanges) {
                                //    exitLoop = true;
                                //    return false; //break from each loop, we are done updating DOM for this model
                                //}
                            }
                        }

                    });
                }
            )
            ;

        };

        AdhesiveDOMController.prototype.updateDOMViaCollectionChange = function (domKeyName, collection, domElement, modelCIDHash, eventName) {


            /*

             if (!document.contains(domElement)) {
             console.log('visible document does not contain element, so why update it');
             return;
             } //TODO: listeners should be removed once the view is removed

             if (eventName === 'coll-add') {
             //if we add a model to a collection, for now we just re-render the view, it's just way easier
             //later on we can use jQuery to add a row to a table instead of just re-rendering the entire view
             this.view.render();
             return;
             }

             */

            var exitLoop = false;
            var numChanges = 0;

            domElement.find('*').each(function () {

                if (exitLoop) {
                    return false;
                }

                var self = this;

                $.each(self.attributes, function (i, attrib) {
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
                        var nestedProps = propsArray.join('.');


                        var cid = $(self).attr('adhesive-cid');

                        if (cid) {
                            var foundModel = modelCIDHash[cid];

                            if (foundModel) {

                                var model = foundModel.model;
                                var val = model.get(modelProp);

                                if (val == null) {
                                    val = util.inspect(model.attributes);
                                }
                                else if (nestedProps.length > 0) {
                                    val = eval('val.' + nestedProps);
                                }

                                if (typeof val === 'object') {
                                    val = util.inspect(val);
                                }

                                func(self, val); //done!

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

    })
;