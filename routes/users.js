var express = require('express');
var router = express.Router();

/* GET usersRoutes listing. */


router.get('/', function (req, res, next) {

    //var db = req.site.mongoDB;

    var UserModel = req.site.models.User;
    var User = UserModel.getNewUser();
    User.find({}, function (err, items) {
        if (err) {
            return next(err);
        }
        //console.log(items);
        res.json(items);
    });

});

router.get(':user_id', function (req, res, next) {

    var user_id = req.params.user_id;
    var user = req.specialParams.model;

    user.save(function (err, result) {
        if (err) {
            console.log("error in user save method:", err);
            res.send('database error');
        }
        else if (result) {
            res.send(user);
        }
        else {
            next(new Error('grave error in newUser.save method in users'));
        }
    });

});


router.post('/', function (req, res, next) {

    console.log('about to post new user:', req.body);

    var user = req.body;
    var firstName = user.firstName;
    var lastName = user.lastName;
    var username = user.username;
    var password = user.password;
    var email = user.email;

    var UserModel = req.site.models.User;
    var User = UserModel.getNewUser();

    var newUser = new User({
        username: username,
        password: password,
        email: email,
        firstName: firstName,
        lastName: lastName
    });

    newUser.save(function (err, result) {
        if (err) {
            console.log("error in user save method:", err);
            res.send('database error');
        }
        else if (result) {
            console.log('Added new user: ', result);
            //postRegistrationInfo(req,res,next,true);
            //res.json('successful user registration');
            loginNewlyRegisteredUser(result, req, res, next)
        } else {
            next(new Error('grave error in newUser.save method in registration'));
        }
    });
});


router.put('/:user_id', function (req, res, next) {

    console.log('about to post new user:', req.body);

    var user = req.body;
    var firstName = user.firstName;
    var lastName = user.lastName;
    var username = user.username;
    var password = user.password;
    var email = user.email;

    var UserModel = req.site.models.User;
    var User = UserModel.getNewUser();

    var newUser = new User({
        username: username,
        password: password,
        email: email,
        firstName: firstName,
        lastName: lastName
    });

    newUser.save(function (err, result) {
        if (err) {
            console.log("error in user save method:", err);
            res.send('database error');
        }
        else if (result) {
            console.log('Added new user: ', result);
            //postRegistrationInfo(req,res,next,true);
            //res.json('successful user registration');
            loginNewlyRegisteredUser(result, req, res, next)
        } else {
            next(new Error('grave error in newUser.save method in registration'));
        }
    });
});


router.delete(':user_id', function (req, res, next) {
    res.send('respond with a resource');
});


module.exports = router;
