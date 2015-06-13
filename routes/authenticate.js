/**
 * Created by amills001c on 6/11/15.
 */

var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next) {

    if(false){
        res.json({"authenticated":true});
    }else{
        res.send('not authenticated');
    }
});

module.exports = router;
