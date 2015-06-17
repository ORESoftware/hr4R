var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

  console.log('cookies', req.cookies);
  console.log('session', req.session);

  if (req.session.passport.user) {
    console.log("user session exists...checking DB for user");
    var Model = req.site.models.User;

    var User = Model.getNewUser();
    User.findById(req.session.passport.user, function (err, user) {
      if (err) {
        next(err);
        return;
      }
      else if (!user) {
        console.error('user session existed, but no user matched');
        next(new Error('user session existed, but no user matched'));
        return;
      } else {
        //res.render('home', {
        //  userInfo:user
        //});
        res.json({msg:user});
      }
    });
  } else {
    console.log("rendering index...");
    //res.redirect('/login');
    res.render('index', { title: 'SmartConnect Admin Portal' });
  }

});

module.exports = router;
