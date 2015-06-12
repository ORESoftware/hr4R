/**
 * Created by amills001c on 6/11/15.
 */


var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next) {

    res.json({"authenticated":true});
});

module.exports = router;
