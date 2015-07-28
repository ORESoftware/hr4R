/**
 * Created by amills001c on 6/11/15.
 */

var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next) {

    var env = process.env.NODE_ENV;

    if (req.isAuthenticated() && req.user) {
        res.json({isAuthenticated:true, user:req.user, env:env});
    } else {
        res.json({isAuthenticated:false, user:null ,env:env});
    }
});



module.exports = router;
