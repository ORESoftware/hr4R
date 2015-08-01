/**
 * Created by amills001c on 6/15/15.
 */


var express = require('express');
var router = express.Router();
var IJSON = require('idempotent-json');


router.param('job_id', function (req, res, next, job_id) {
    // typically we might sanity check that job_id is of the right format
    if (job_id == undefined || job_id == null) {
        console.log('null job_id');
        return next(new Error("job_id is null"));
    }

    var JobModel = req.site.models.Job;
    req.specialParams = {};

    JobModel.get(function (err, Job) {
        Job.findById(job_id, function (err, job) {
            if (err) {
                return next(err);
            }
            if (!job) {
                req.specialParams.job_model = null;
            }
            else {
                req.specialParams.job_model = job;
            }

            next();
        });
    });
});


// middleware specific to this router
//router.use(function timeLog(req, res, next) {
//    console.log('Time: ', Date.now());
//    next();
//});


router.get('/', function (req, res, next) {

    var JobModel = req.site.models.Job;
    JobModel.get(function (err, Job) {
        Job.find({}, function (err, items) {
            if (err) {
                res.json({error: {}});
                return next(err);
            }
            else {
                res.json({success: items});
            }
        });
    });
});


router.get('/:job_id', function (req, res, next) {

    var job_id = req.params.job_id;
    var job = req.specialParams.job_model;

    //job.save(function (err, result) {
    //    if (err) {
    //        console.log("error in job save method:", err);
    //        res.send('database error');
    //    }
    //    else if (result) {
    //        res.send(job);
    //    }
    //    else {
    //        next(new Error('grave error in newJob.save method in jobs'));
    //    }
    //});

    if (job) {
        res.json(job);
    }
    else {
        res.json({error: 'no job found'});
        return next(new Error('no job found.'));
    }

});


router.post('/', function (req, res, next) {

    console.log('about to post new job:', req.body);

    var job = req.body;
    var jobName = job.jobName;
    var animals = job.animals;
    var created_by = job.created_by;
    var created_at = job.created_at;
    var updated_by = job.updated_by;
    var updated_at = job.updated_at;


    var JobModel = req.site.models.Job;
    JobModel.get(function (err, Job) {

        if (err) {
            throw err;
        }

        var newJob = new Job({
            jobName: jobName,
            animals:animals,
            created_by: created_by,
            created_at: created_at,
            updated_by: updated_by,
            updated_at: updated_at
        });


        newJob.save(function (err, result) {
            if (err) {
                console.log("error in job save method:", err);
                res.send({error: err.errors});
            }
            else if (result) {
                console.log('Added new job: ', result);
                delete result.passwordPreHash;
                res.json({success: result});
            }
            else {
                next(new Error('grave error in newJob.save method in registration'));
            }
        });
    });
});


router.put('/:job_id', function (req, res, next) {

    var jobToUpdate = req.specialParams.job_model;

    if (jobToUpdate == null) {
        return next(new Error('router params did not pick up job with PUT jobs/:job_id'));
    }

    console.log('about to PUT job:', jobToUpdate, 'with this info:', req.body);

    var job = req.body;
    var jobName = job.jobName;


    jobToUpdate.save(function (err, result) {
        if (err) {
            console.log("error in job put method:", err);
            res.json({error: err});
            return next(err);
        }
        else if (result) {
            return res.json({success: result});
        }
        else {
            next(new Error('grave error in newJob.save method in registration'));
        }
    });
});


router.delete('/:job_id', function (req, res, next) {

    var JobModel = req.site.models.Job;
    JobModel.get(function (err, Job) {

        if (err) {
            throw err;
        }
        else {
            var jobToDelete = req.specialParams.job_model;

            if (!jobToDelete) {
                return next(new Error('no job matched'));
            }
            else {
                Job.remove({_id: jobToDelete._id}, function (err) {
                    if (err) {
                        res.send({error: err.toString()})
                        return next(err);
                    }
                    else {
                        res.send({success: jobToDelete});
                    }
                });
            }
        }
    });
});


module.exports = router;
