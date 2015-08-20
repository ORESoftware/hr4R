/**
 * Created by amills001c on 8/18/15.
 */


function put(Model, modelName, data, opts, req, res, next, cb) {


    //TODO: http://mongoosejs.com/docs/api.html#model_Model.findOneAndUpdate

    if (!Model) {
        Model = req.site.models[modelName];
    }
    if (!Model) {
        throw new Error('no model matched modelName --> ' + modelName);
    }
    opts = opts || {upsert: true};

    function done(err, result) {

        //TODO: this function could be shared for all of post/put/get/getAll/etc?
        if (typeof cb === 'function') {
            cb(err, result);
        }
        else {
            if (err) {
                res.json({error: err.toString()});
                next(err);
            }
            else {
                res.json({success: result});
            }
        }
    }

    //for(var datum in newData){
    //    if(newData.hasOwnProperty(datum)) {
    //        model[datum] = datum;
    //    }
    //}


    //newModel.save(function (err, result) {
    //    if (err) {
    //        cb(err);
    //    }
    //    else if (result) {
    //        cb(null, {success: result});
    //    }
    //    else {
    //        cb(new Error('grave error in model.save method'));
    //    }
    //});

    Model.get(function (err, Model) {

        if (err) {
            throw err;
        }

        var model = new Model(data);

        model.update({}, opts, function (err, result) {
            if (err) {
                done(err);
            }
            else if (result) {
                //TODO: result contains only n, nModified, ok, but not the model itself
                done(null, result);
            }
            else {
                done(new Error('grave error in model.save method'));
            }
        });

    });


    /*var conditions = { name: 'borne' }
     , update = { $inc: { visits: 1 }}
     , options = { multi: true };

     Model.update(conditions, update, options, callback);

     function callback (err, numAffected) {
     // numAffected is the number of updated documents
     })*/

}

module.exports = put;