var express = require('express');
var router = express.Router();



/* GET home page. */
router.get('/', function (req, res, next) {

    if (req.session.passport.user) {
        console.log("user session exists...checking DB for user");
        var UserModel = req.site.models.User;

        UserModel.get(function(err,model){

            if(err){
                throw err;
            }

            model.findById(req.session.passport.user, function (err, user) {
                if (err) {
                    next(err);
                    return;
                }
                else if (!user) {
                    console.error('user session existed, but no user matched');
                    next(new Error('user session existed, but no user matched'));
                    return;
                }
                else {
                    //res.json({msg: user});
                    res.render('index', {title: 'SmartConnect Admin Portal'});
                }
            });

        });

    } else {
        console.log("no passport session found in index route, rendering index page...");

        res.render('index', {title: 'SmartConnect Admin Portal'});

    }

});

module.exports = router;
