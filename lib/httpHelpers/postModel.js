/**
 * Created by denmanm1 on 8/18/15.
 */


function post(Model, modelName, data, req, res, next, cb) {

    if (!Model) {
        Model = req.site.models[modelName];
    }
    if (!Model) {
        throw new Error('no model matched modelName --> ' + modelName);
    }

    Model.get(function (err, Model) {

        if (err) {
            throw err;
        }


        function done(err, result) {
            if (typeof cb === 'function') {
                cb(err, result);
            }
            else {
                if (err) {
                    res.json({error: err});
                    next(err);
                }
                else {
                   res.json({success:result});
                }
            }
        }

        var newModel = new Model(data);

        //save should be identical to update with upsert set to true
        newModel.save(function (err, result) {
            if (err) {
                done(new Error({error: err.errors}));
            }
            else if (result) {
                done(null, result);
            }
            else {
                done(new Error('grave error in model.save method'));
            }
        });
    })
}

module.exports = post;
