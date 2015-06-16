var express = require('express');
var router = express.Router();

/* GET usersRoutes listing. */
router.get('/', function (req, res, next) {

    var db = req.site.mongoDB;

    var UserModel = req.site.models.User;
    var User = UserModel.getNewUser();
    User.find({}, function (err, items) {
        if (err) {
            throw err;
        }
        console.log(items);
        res.json(items);
    });

});

router.get(':user_id', function (req, res, next) {

    var user_id = req.params.user_id;

    var UserModel = req.site.models.User;
    var User = UserModel.getNewUser();

    User.findById(user_id, function (err, user) {
        if (err) {
            return next(err);
        }
        if (!user) {
            console.log('no user matched');
            return next(new Error("no user matched"));
        }
        res.json(user);
    });

});

router.post(':user_id', function (req, res, next) {

    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var username = req.body.username;
    var password = req.body.password;
    var email = req.body.email;

    var Model = req.site.models.User;
    var User = Model.getNewUser();

    var newUser = new User({
        username: username,
        password: password,
        firstName: firstName,
        lastName: lastName,
        email: email
    });

    newUser.save(function (err, result) {
        if (err) {
            return next(err);
        }
        if (result) {
            console.log('Added new user: ', result);
            res.send('successful user registration');
        } else {
            next(new Error('no result in newUser save method.'));
        }
    });

});

router.delete(':user_id', function (req, res, next) {
    res.send('respond with a resource');
});


module.exports = router;
