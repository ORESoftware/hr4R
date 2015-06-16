/**
 * Created by amills001c on 6/15/15.
 */




app.get('/session', function (req, res, next) {

    if(req.user){
        res.json(req.user);
    }
    else{
        res.send('no user session found on server');
    }

});

app.get('/changePassword',function (req, res, next) {

    // APP render as opposed to res.render???

    var shasum = crypto.createHash('sha256');
    shaSum.update(req.body.newPassword);
    var hashedPassword = shaSum.digest('hex');
    var Model = req.site.models.User;
    Model.update({_id: req.user._id}, {$set: {password: hashedPassword}}, {upsert: false}),
        function changePasswordCallback(err) {
            console.log('change password complete');
        }
    });


app.post('/login', passport.authenticate('local', {
    failureRedirect: '/badLogin',
    failureFlash: true
}), loginSuccessfully);


var loginSuccessfully = function (req, res, next) {

    var user = req.user;
    if(!user){
        throw new Error('no user in loginsuccessfully function')
    }
    res.json(user);
};