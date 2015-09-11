/**
 * Created by amills001c on 7/23/15.
 */


//TODO: insert a new row in table without re-rendering http://stackoverflow.com/q/31665966/1223975


define(
    [
        'underscore',
        'app/js/adhesive/AdhesiveDOMController',
        'app/js/adhesive/AdhesiveStateController'
    ],

    function (_, ADC, ASC) {


        var stateController = new ASC();
        var domController = new ADC();


        function Adhesive(view, opts) {
            this.view = view;
            _.extend(this, Backbone.Events);
            //this.stick = stick.bind(this);
            this.jQueryBinds = [];
            this.stateController = new ASC(view);
            this.domController = new ADC(view);
        }

        Adhesive.prototype.unStick = function () {
            this.stopListening();
            _.each(this.jQueryBinds, function (el, index) {
                el.unbind();
                el.off();
            });
        };

        Adhesive.prototype.stick = function (opts) {

            //TODO: give these default values inside this class
            var domKeyName = opts.keyName || 'model';
            var domElementListen = opts.domElementListen || this.view.$el;
            var domElementUpdate = opts.domElementUpdate || this.view.$el;
            var domEventType = opts.domEventType || 'click';
            var limitToEventTarget = opts.limitToEventTarget === false ? false : true; //default is true, need to explicitly pass in false for it to be false
            var propagateChangesToServerImmediately = opts.propagateChangesToServerImmediately || true;
            var limitToClass = opts.limitToClass;


            this.jQueryBinds.push(domElementListen);


            var self = this;

            var plainObjects = opts.plainObjects;
            if (typeof plainObjects === 'object') {

                var plainObjectsToListenTo = plainObjects.listenTo || [];
                var plainObjectEvents = plainObjects.events || [];
                var plainObjectsToUpdate = plainObjects.update || [];

                if (plainObjectEvents && plainObjectEvents.length > 0) {

                    plainObjectEvents = plainObjectEvents.join(' '); //separate event-names by a space
                    _.each(plainObjectsToListenTo, function (obj, index) {
                        self.listenTo(obj, plainObjectEvents, function (eventName) {
                            self.domController.updateDOMViaPlainObjectChange(domKeyName, domElementUpdate, obj, eventName);
                        });
                    });

                }

                if (plainObjectsToUpdate && plainObjectsToUpdate.length > 0) {

                    if (limitToClass) {
                        domElementListen = domElementListen.find(limitToClass);
                    }
                    domElementListen.on(domEventType, function (event) { //click will only be registered in html is in DOM anyway so...assume it is there

                        event.preventDefault();
                        if (limitToEventTarget) { //TODO: update this with proper condition
                            event.stopPropagation();
                        }

                        self.stateController.updatePlainObjects(domKeyName, domElementListen, plainObjectsToUpdate, event, limitToEventTarget);

                    });
                }
            }

            var models = opts.models;
            if (typeof models === 'object') {

                var modelsToListenTo = models.listenTo || [];
                var modelEvents = models.modelEvents || [];
                var modelsToUpdate = models.update || [];


                if (modelEvents && modelEvents.length > 0) {

                    modelEvents = modelEvents.join(' '); //separate event-names by a space
                    _.each(modelsToListenTo, function (model, index) {
                        self.listenTo(model, modelEvents, function (model) {
                            self.domController.updateDOMViaModelChange(domKeyName, model, domElementUpdate);
                        });
                    });

                }

                if (modelsToUpdate && modelsToUpdate.length > 0) {

                    if (limitToClass) {
                        domElementListen = domElementListen.find(limitToClass);
                    }

                    domElementListen.on(domEventType, function (event) { //click will only be registered in html is in DOM anyway so...assume it is there

                        event.preventDefault();
                        if (limitToEventTarget) { //TODO: update this with proper condition
                            event.stopPropagation();
                        }

                        self.stateController.updateBackboneModels(domKeyName, domElementListen, modelsToUpdate, event, limitToEventTarget);

                    });
                }
            }

            var collections = opts.collections;
            if (typeof collections === 'object') {

                var collectionsToListenTo = collections.listenTo || [];
                var collectionEvents = collections.collectionEvents || [];
                var collectionsToUpdate = collections.update || [];
                var filterUpdateFunction = collections.filterUpdateFunction || function () {
                        return true;
                    };

                if (collectionEvents && collectionEvents.length > 0) {

                    collectionEvents = collectionEvents.join(' '); //separate event-names by a space

                    _.each(collectionsToListenTo, function (coll, index) {
                        self.listenTo(coll, collectionEvents, function (models, eventName) {
                            self.domController.updateDOMViaCollectionChange(domKeyName, coll, domElementUpdate, models, eventName);
                        });
                    });
                }


                if (collectionsToUpdate && collectionsToUpdate.length > 0) {

                    if (limitToClass) {
                        domElementListen = domElementListen.find(limitToClass);
                    }

                    domElementListen.on(domEventType, function (event) {

                        event.preventDefault();
                        if (limitToEventTarget) {  //TODO: update this with proper condition
                            event.stopPropagation();
                        }

                        self.stateController.updateBackboneCollections(
                            domKeyName, domElementListen, collectionsToUpdate, event,
                            limitToEventTarget, filterUpdateFunction
                        );

                    });
                }
            }

            return this;
        };

        return Adhesive;
    }
);