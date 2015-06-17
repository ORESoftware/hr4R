/**
 * Created by amills001c on 6/11/15.
 */

var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next) {

    if (req.user) {
        res.json({"authenticated":true});
    } else {
        res.json({"authenticated":false});
    }
});

module.exports = router;
