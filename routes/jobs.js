/**
 * Created by denmanm1 on 6/15/15.
 */

//logging


//config
var config = require('univ-config')('*SC-Admin*', 'config/conf');

//core
var express = require('express');
var router = express.Router();
var IJSON = require('idempotent-json');

//http helpers
var get = require('../lib/httpHelpers/getModel.js');
var getAll = require('../lib/httpHelpers/getModels.js');
var post = require('../lib/httpHelpers/postModel.js');
var put = require('../lib/httpHelpers/putModel.js');
var del = require('../lib/httpHelpers/deleteModel.js');



/*** jobs routes ***/

router.param('job_id', function (req, res, next, job_id) {
    // TODO: typically we might sanity check that job_id is of the right format
    if (job_id == undefined || job_id == null) {
        console.log('null job_id');
        return next(new Error("job_id is null"));
    }
    else {
        next();
    }
});


// middleware specific to this router
//router.use(function timeLog(req, res, next) {
//    console.log('Time: ', Date.now());
//    next();
//});


router.get('/', function (req, res, next) {

    var JobModel = req.site.models.Job;
    getAll(JobModel, 'Job', null, req, res, next);

});


router.get('/:job_id', function (req, res, next) {

    var JobModel = req.site.models.Job;
    var job_id = req.params.job_id;
    get(JobModel, 'Job', job_id, req, res, next);

});


router.post('/', function (req, res, next) {

    var JobModel = req.site.models.Job;
    var jobData = req.body;
    post(JobModel, null, jobData, req, res, next);

});


router.put('/:job_id', function (req, res, next) {

    //TODO: do new Job(data).update({upsert:true}) ?

    var JobModel = req.site.models.Job;
    var jobData = req.body;
    put(JobModel, null, jobData, null, req, res, next);

});


router.delete('/:job_id', function (req, res, next) {

    var JobModel = req.site.models.Job;
    var job_id = req.params.job_id;
    del(JobModel, null, job_id, req, res, next);


});


module.exports = router;
