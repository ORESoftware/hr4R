/**
 * Created by amills001c on 6/15/15.
 */


/*
 function registerRoutes(app){

 app.get('/logout',function (req, res, next) {
 req.session.user_id = undefined;
 req.session.passport.user = null;
 req.user = undefined;
 req.logout();
 //res.redirect('/login');
 res.redirect('/');
 });

 app.post('/logout',function (req, res, next) {
 req.session.user_id = undefined;
 req.session.passport.user = null;
 req.user = undefined;

 req.logout();
 req.session.destroy(function (err) {
 if (err) {
 res.json(false);
 return next(err);
 }
 else {
 console.log('req.session.destroy called successfully');
 res.json(true);
 }
 });
 });
 }


 module.exports = registerRoutes;*/

var router = require('express').Router();


router.get('/logout',function (req, res, next) {
    req.session.user_id = undefined;
    req.session.passport.user = null;
    req.user = undefined;
    req.logout();
    //res.redirect('/login');
    //res.redirect('/');
    req.session.destroy(function (err) {
        if (err) {
            res.json(false);
            return next(err);
        }
        else {
            console.log('req.session.destroy called successfully');
            res.json(true);
        }
    });
});

router.post('/logout',function (req, res, next) {
    req.session.user_id = undefined;
    req.session.passport.user = null;
    req.user = undefined;
    req.logout();
    req.session.destroy(function (err) {
        if (err) {
            res.json(false);
            return next(err);
        }
        else {
            console.log('req.session.destroy called successfully');
            res.json(true);
        }
    });
});


module.exports = router;