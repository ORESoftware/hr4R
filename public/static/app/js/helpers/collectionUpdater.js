/**
 * Created by denmanm1 on 9/10/15.
 */



define(function () {


    function handleInsert(collection, data) {

        var _id = data._id;
        //var data = data.upd

        for (var i = 0; i < collection.models.length; i++) {
            var model = collection.models[i];
            if (String(model.get('_id')) == String(_id)) {
                model.set(data, {silent: true, socketChange: true});
                collection.trigger('coll-change-socket', model, {});
                return;
            }
        }

        var ModelType = collection.model;
        var newModel = new ModelType(data);
        collection.add(newModel, {silent: true});
        collection.trigger('coll-add-socket', newModel, {});
    }

    function handleUpdate(collection, data) {

        var _id = data._id;
        data = data.updateInfo;

        for (var i = 0; i < collection.models.length; i++) {
            var model = collection.models[i];
            if (String(model.get('_id')) == String(_id)) {
                model.set(data, {silent: true, socketChange: true});
                collection.trigger('coll-change-socket', model, {});
                return;
            }
        }

        var ModelType = collection.model;
        var newModel = new ModelType(data);
        collection.add(newModel, {silent: true}); //TODO: why silent??
        collection.trigger('coll-add-socket', newModel, {});
    }

    function handleRemove(collection, data) {

        var _id = data._id;

        for (var i = 0; i < collection.models.length; i++) {
            var model = collection.models[i];
            if (String(model.get('_id')) == String(_id)) {
                collection.remove(model);
                collection.trigger('coll-remove-socket', model, {});
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