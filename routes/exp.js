/**
 * Created by amills001c on 9/15/15.
 */


var express = require('express');
var router1 = express.Router();
var router2 = express.Router();



router1.get('/', function (req, res, next) {

    res.send('exp canonical route reached');

});

router1.route('/api/dogs')
    .all(function (req, res, next) {

        res.send('exp /api/dogs route reached');

    })
    .get(function (req, res, next) {

        res.send('exp /api/dogs route reached');

    })
    .post(function (req, res, next) {

        res.send('exp /api/dogs route reached');

    });


//router1.use('/api/birds',router2);

router1.use('/api/birds',function(req,res,next){
    router2(req,res,next);
});

router2.route('/')
    .all(function(req,res,next){
        res.send('exp /api/birds route reached');
    })
    .get(function(req,res,next){
        res.send('exp /api/birds route reached');
    });





module.exports = router1;