/**
 * Created by amills001c on 6/15/15.
 */


var express = require('express');
var router = express.Router();
var IJSON = require('idempotent-json');

var get = require('../lib/httpHelpers/getModel.js');
var getAll = require('../lib/httpHelpers/getModels.js');
var post = require('../lib/httpHelpers/postModel.js');
var put = require('../lib/httpHelpers/putModel.js');
var del = require('../lib/httpHelpers/deleteModel.js');


router.param('job_id', function (req, res, next, job_id) {
    // TODO: typically we might sanity check that job_id is of the right format
    if (job_id == undefined || job_id == null) {
        console.log('null job_id');
        return next(new Error("job_id is null"));
    }
    else {
        next();
    }

    //var JobModel = req.site.models.Job;
    //req.specialParams = {};
    //
    //JobModel.get(function (err, Job) {
    //    Job.findById(job_id, function (err, job) {
    //        if (err) {
    //            return next(err);
    //        }
    //        if (!job) {
    //            req.specialParams.job_model = null;
    //        }
    //        else {
    //            req.specialParams.job_model = job;
    //        }
    //
    //        next();
    //    });
    //});
});


// middleware specific to this router
//router.use(function timeLog(req, res, next) {
//    console.log('Time: ', Date.now());
//    next();
//});


router.get('/', function (req, res, next) {


    var JobModel = req.site.models.Job;

    //JobModel.get(function (err, Job) {
    //    Job.find({}, function (err, items) {
    //        if (err) {
    //            res.json({error: {}});
    //            return next(err);
    //        }
    //        else {
    //            res.json({success: items});
    //        }
    //    });
    //});

    getAll(JobModel, 'Job', null, req, res, next);

});


router.get('/:job_id', function (req, res, next) {

    var JobModel = req.site.models.Job;
    var job_id = req.params.job_id;
    //var job = req.specialParams.job_model;

    get(JobModel, 'Job', job_id, req, res, next);

    //if (job) {
    //    res.json({success: job});
    //}
    //else {
    //    res.json({error: 'no job found'});
    //    return next(new Error('no job found.'));
    //}

});


router.post('/', function (req, res, next) {

    /*  var jobData = req.body;
     //var jobName = job.jobName;
     //var animals = job.animals;
     //var firstName = job.firstName;
     //var lastName = job.lastName;
     //var isVerified = job.isVerified;
     //var created_by = job.created_by;
     //var created_at = job.created_at;
     //var updated_by = job.updated_by;
     //var updated_at = job.updated_at;


     var JobModel = req.site.models.Job;
     JobModel.get(function (err, Job) {

     if (err) {
     throw err;
     }

     var newJob = new Job(jobData);

     newJob.save(function (err, result) {
     if (err) {
     console.log(colors.red("error in job save method:", err));
     res.send({error: err.toString()});
     }
     else if (result) {
     res.json({success: result});
     }
     else {
     next(new Error('grave error in newJob.save method in registration'));
     }
     });
     });*/

    var JobModel = req.site.models.Job;
    var jobData = req.body;

    post(JobModel, null, jobData, req, res, next);
});


router.put('/:job_id', function (req, res, next) {

    //TODO: do new Job(data).update({upsert:true}) ?

    //var jobToUpdate = req.specialParams.job_model;
    //
    //if (jobToUpdate == null) {
    //    return next(new Error('router params did not pick up job with PUT jobs/:job_id'));
    //}
    //
    //console.log('about to PUT job:', jobToUpdate, 'with this info:', req.body);
    //
    //var job = req.body;
    //var jobName = job.jobName;
    //var firstName = job.firstName;
    //var lastName = job.lastName;
    //var isVerified = job.isVerified;
    //var updated_by = job.updated_by;
    //var updated_at = job.updated_at;
    //
    //
    //jobToUpdate.firstName = firstName;
    //jobToUpdate.lastName = lastName;
    //jobToUpdate.jobName = jobName;
    //jobToUpdate.updated_by = updated_by;
    //jobToUpdate.updated_at = updated_at;
    //jobToUpdate.isVerified = isVerified;
    //
    //jobToUpdate.save(function (err, result) {
    //    if (err) {
    //        console.log(colors.bgRed("error in job put method:", err));
    //        res.json({error: err});
    //        return next(err);
    //    }
    //    else if (result) {
    //        return res.json({success: result});
    //    }
    //    else {
    //        next(new Error('grave error in newJob.save method in registration'));
    //    }
    //});

    var JobModel = req.site.models.Job;
    var jobData = req.body;

    put(JobModel, null, jobData, null, req, res, next);

});


router.delete('/:job_id', function (req, res, next) {

    var JobModel = req.site.models.Job;


    //var job_id = req.body._id;

    var job_id = req.params.job_id;
    del(JobModel, null, job_id, req, res, next);


});


module.exports = router;
