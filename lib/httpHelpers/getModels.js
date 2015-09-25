/**
 * Created by denmanm1 on 8/18/15.
 */


function getAll(Model, modelName, filterObject, req, res, next, cb) {


    if (!Model) {
        Model = req.site.models[modelName];
    }
    if (!Model) {
        throw new Error('no model matched modelName --> ' + modelName);
    }

    filterObject = filterObject || {};

    Model.get(function (err, Model) {

        if (err) {
            throw err;
        }
        Model.find(filterObject, function (err, items) {
            if (err) {
                res.json({error: err.toString()});
                return next(err);
            }
            else {
                res.json({success: items});
            }
        });
    });
}

module.exports = getAll;