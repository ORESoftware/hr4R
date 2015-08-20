/**
 * Created by amills001c on 8/18/15.
 */




function pessimisticDelete(){

        JobModel.get(function (err, Job) {

            if (err) {
                throw err;
            }
            else {
                var jobToDelete = req.specialParams.job_model; //TODO: this is no longer defined, need to fix

                if (!jobToDelete) {
                    return next(new Error('no job matched'));
                }
                else {
                    Job.remove({_id: jobToDelete._id}, function (err) {
                        if (err) {
                            res.send({error: err.toString()});
                            return next(err);
                        }
                        else {
                            res.send({success: jobToDelete});
                        }
                    });
                }
            }
        });
}


function optimisticDelete(){

    if (!Model) {
        Model = req.site.models[modelName];
    }
    if (!Model) {
        throw new Error('no model matched modelName --> ' + modelName);
    }


    function done(err, result) {
        //TODO: this function could be shared for all of post/put/get/getAll/etc
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


    Model.get(function (err, Model) {

        if (err) {
            throw err;
        }

        /*

         As of "mongoose": ">=2.7.1" you can remove the document directly with the .remove() method rather
         than finding the document and then removing it which seems to me more efficient and easy to maintain.

         See example:

         */

        Model.remove({_id: model_id}, function (err) {
            if (err) {
                done(err);
            }
            else {
                done(null, {})
            }
        });
    });

}

function del() {

    if(req.query.optimisticDelete){
        optimisticDelete(arguments);
    }
    else{
        optimisticDelete(arguments);
        //pessimisticDelete(arguments);
    }
}

module.exports = del;