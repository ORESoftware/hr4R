/**
 * Created by amills001c on 8/18/15.
 */


function put(model, newData, cb) {


    //TODO: if model doesn't exist yet, we could turn this into a post instead of put, depends on use case and desired functionality, for now, fail fast

    for(var datum in newData){
        if(newData.hasOwnProperty(datum)) {
            model[datum] = datum;
        }
    }

    cb = (typeof cb === 'function') ? cb : function () {
    };

    model.save(function (err, result) {
        if (err) {
            cb(err);
        }
        else if (result) {
            cb(null,{success: result});
        }
        else {
            cb(new Error('grave error in model.put method'));
        }
    });
}

module.exports = put;