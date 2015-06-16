/**
 * Created by amills001c on 6/15/15.
 */


function registerRoutes(app){

    app.get('/logout',function (req, res, next) {
        req.session.user_id = undefined;
        req.session.passport.user = null;
        req.user = undefined;
        req.logout();
        res.redirect('/login');
    });

    app.post('/logout',function (req, res, next) {
        req.session.user_id = undefined;
        req.session.passport.user = null;
        req.user = undefined;

        req.logout();
        //req.session.destroy(function (err) {
        //    if (err) {
        //        console.log(err);
        //    }
        //    else {
        //        console.log('req.session.destroy called successfully');
        //    }
        //    res.redirect('/login');
        //});
        res.redirect('/login');
    });
}


module.exports = registerRoutes;