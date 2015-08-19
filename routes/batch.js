/**
 * Created by denman on 7/5/2015.
 */


var express = require('express');
var router = express.Router();


var _ = require('underscore');
var async = require('async');

//TODO: http://forbeslindesay.github.io/express-route-tester/


/*// middleware specific to this router
 router.use(function matchBatchURL(req, res, next) {

 var origURLWithoutSlashes = String(req.originalUrl).replace(/^\/|\/$/g, '');

 if (typeof batch[origURLWithoutSlashes] === 'function') { //replace all slashes
 batch[origURLWithoutSlashes](req, res, next);
 }
 else {
 next();
 }
 });

 router.use(function (req, res, next) {

 console.log('no route matched for users batch?!?!');

 next();
 });*/

router.param('collection', function (req, res, next, collectionName) {
    // typically we might sanity check that user_id is of the right format

    next();
});

//router.post('/',function(req,res,next){
//
//    res.send({});
//});

router.post('/:collection',function(req,res,next){

    var modelName = req.params.collection;
    var models = req.body.models;

    if (!models) {
        //res.send({});
        throw new Error('no models in batch');
    }

    var Model = req.site.models[modelName];

    if (!Model) {
        throw new Error('no model named matched');
    }

    Model.get(function (err, Model) {

        if (err) {
            throw err;
        }

        async.each(models, function (data, cb) {

                var newModel = new Model(data);

                newModel.save(function (err, result) {
                    if (err) {
                        cb(err);
                    }
                    else if (result) {
                        cb(null, {success: result});
                    }
                    else {
                        cb(new Error('grave error in model.save method'));
                    }
                });
            },
            function done(err) {
                if (err) {
                    res.send({error: err.toString()})
                }
                else {
                    res.send({success: {}})
                }

            });
    });
});


router.all(function (req, res, next) {

    console.log('batch is in all');
    next();

});


module.exports = router;