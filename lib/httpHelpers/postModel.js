/**
 * Created by amills001c on 8/18/15.
 */


function post(modelName, data, cb) {

    console.log('about to post new job:', req.body);

    var Model = req.site.models[modelName];
    Model.get(function (err, Model) {

        if (err) {
            throw err;
        }

        var newModel = new Model(data);
        cb = (typeof cb === 'function') ? cb : function () {
        };


        newModel.save(function (err, result) {
            if (err) {
                cb(new Error({error: err.errors}));
            }
            else if (result) {
                cb(null, {success: result});
            }
            else {
                cb(new Error('grave error in model.save method'));
            }
        });
    })
}

module.exports = post;
