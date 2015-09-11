/**
 * Created by amills001c on 9/10/15.
 */



define(function () {


    function handleInsert(collection, data) {

        var self = collection;
        var _id = data._id;

        for (var i = 0; i < collection.models.length; i++) {
            var model = collection.models[i];
            if (String(model.get('_id')) == String(_id)) {
                model.set(data, {silent: true, socketChange: true});
                self.trigger('coll-change-socket', model, {});
                return;
            }
        }

        var ModelType = collection.model;
        var newModel = new ModelType(data);
        collection.add(newModel, {silent: true});
        collection.trigger('coll-add-socket', newModel, {});
    }

    function handleUpdate(collection, data) {

        var self = collection;
        var _id = data._id;

        for (var i = 0; i < collection.models.length; i++) {
            var model = collection.models[i];
            if (String(model.get('_id')) == String(_id)) {
                model.set(data, {silent: true, socketChange: true});
                self.trigger('coll-change-socket', model, {});
                return;
            }
        }

        var ModelType = collection.model;
        var newModel = new ModelType(data);
        collection.add(newModel, {silent: true}); //TODO: why silent??
        collection.trigger('coll-add-socket', newModel, {});
    }

    function handleRemove(collection, data) {

        var self = collection;
        var _id = data._id;

        for (var i = 0; i < collection.models.length; i++) {
            var model = collection.models[i];
            if (String(model.get('_id')) == String(_id)) {
                self.remove(model);
                self.trigger('coll-remove-socket', model, {});
                break;
            }
        }
    }

    return {
        handleInsert: handleInsert,
        handleUpdate: handleUpdate,
        handleRemove: handleRemove
    }


});