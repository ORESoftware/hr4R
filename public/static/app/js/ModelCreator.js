/**
 * Created by amills001c on 8/24/15.
 */


/**
 * Created by amills001c on 7/1/15.
 */



define('#ModelCreator',

    [
        'backbone',
        'underscore'
    ],

    function (Backbone, _) {

        function newInstance(ModelClass, attrs,options) {
            var model = new ModelClass(attrs, options);
            model.needsPersisting = true;
            return model;
        }

        return {
            newInstance:newInstance
        }

    });