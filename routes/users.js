var express = require('express');
var router = express.Router();
var IJSON = require('idempotent-json');

/* GET usersRoutes listing. */


//router.use('/', function(req, res, next) {
//    console.log(req.method, req.originalUrl);
//    next();
//}, function (req, res, next) {
//    console.log('');
//    next();
//});

router.param('user_id', function (req, res, next, user_id) {
    // typically we might sanity check that user_id is of the right format
    if (user_id == undefined || user_id == null) {
        console.log('null user_id');
        return next(new Error("user_id is null"));
    }

    var UserModel = req.site.models.User;
    req.specialParams = {};

    UserModel.getNewUser().findById(user_id, function (err, user) {
        if (err) {
            return next(err);
        }
        if (!user) {
            req.specialParams.user_model = null;
        }
        else{
            req.specialParams.user_model = user;
        }

        next();
    });
});

/*
router.route('/:user_id')
    .all(function(req, res, next) {

        next();
    })
    .get(function(req, res, next) {
        res.json(req.user);
    })
    .put(function(req, res, next) {
        // just an example of maybe updating the user
        req.user.name = req.params.name;
        // save user ... etc
        res.json(req.user);
    })
    .post(function(req, res, next) {
        next(new Error('not implemented'));
    })
    .delete(function(req, res, next) {
        next(new Error('not implemented'));
    });
*/

// middleware specific to this router
router.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now());
    next();
});




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


router.get('/:user_id', function (req, res, next) {

    var user_id = req.params.user_id;
    var user = req.specialParams.user_model;

    //user.save(function (err, result) {
    //    if (err) {
    //        console.log("error in user save method:", err);
    //        res.send('database error');
    //    }
    //    else if (result) {
    //        res.send(user);
    //    }
    //    else {
    //        next(new Error('grave error in newUser.save method in users'));
    //    }
    //});

    if(user){
        res.json(user);
        //TODO:have to make sure user is being gotten correctly
    }
    else{
        res.json({error:'no user found'});
        return next(new Error('no user found.'));
    }

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
            res.send({error:err});
        }
        else if (result) {
            console.log('Added new user: ', result);
            res.json({success:result});
        } else {
            next(new Error('grave error in newUser.save method in registration'));
        }
    });
});


router.post('Batch', function (req, res, next) {

    console.log('!!!!!',req.body,'!!!!!');
     res.send({hi:'bye'});
});


router.put('/:user_id', function (req, res, next) {


    var userToUpdate = req.specialParams.user_model;

    if(userToUpdate == null){
        return next(new Error('router params did not pick up user with PUT users/:user_id'));
    }

    console.log('about to PUT user:',userToUpdate,'with this info:', req.body);

    var user = req.body;
    var firstName = user.firstName;
    var lastName = user.lastName;
    var username = user.username;
    var password = user.password;
    //var email = user.email;

    userToUpdate.firstName = firstName;
    userToUpdate.lastName = lastName;
    userToUpdate.username = username;
    userToUpdate.passwordPreHash = password;


    userToUpdate.save(function (err, result) {
        if (err) {
            console.log("error in user put method:", err);
            res.json({error:err});
            return next(err);
        }
        else if (result) {
            console.log('put/updated user: ', result);
            var str = IJSON.stringify({success:result});
            return res.json({success:result});
        } else {
            next(new Error('grave error in newUser.save method in registration'));
        }
    });
});


router.delete('/:user_id', function (req, res, next) {

    var UserModel = req.site.models.User;
    var User = UserModel.getNewUser();

    var userToDelete = req.specialParams.user_model;

    User.remove({_id:userToDelete._id},function(err){
        if(err){
            return next(err);
        }
        else{
            res.send(userToDelete);
        }
    });
});


module.exports = router;
