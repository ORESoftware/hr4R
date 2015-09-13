/**
 * Created by amills001c on 8/18/15.
 */


function get(Model, modelName, model_id, req, res, next, cb) {

    console.log(colors.bgGreen('douche2!'));

    if (!Model) {
        Model = req.site.models[modelName];
    }
    if (!Model) {
        throw new Error('no model matched modelName --> ' + modelName);
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


    Model.get(function (err, Model) {
        Model.findById(model_id, function (err, model) {
            if (err) {
                done(err);
            }
            if (model) {
                done(null,model);
            }
            else {
                done(new Error('grave error in getModel callback'));
            }
        });
    });
}

module.exports = get;