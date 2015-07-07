/**
 * Created by denman on 7/5/2015.
 */


var express = require('express');
var router = express.Router();

//TODO: http://forbeslindesay.github.io/express-route-tester/


// middleware specific to this router
router.use(function matchBatchURL(req, res, next) {

    var origURLWithoutSlashes =  String(req.originalUrl).replace(/^\/|\/$/g, '');

    if(typeof batch[origURLWithoutSlashes] === 'function'){ //replace all slashes
        batch[origURLWithoutSlashes](req,res,next);
    }
    else{
        next();
    }
});

router.use(function(req, res, next) {

  console.log('no route matched for users batch?!?!');

    next();
});



var batch = {

    users_batch: function (req, res, next) {

      res.json({});
    },

    buggers_batch: function (req, res, next) {


    }


};


module.exports = router;