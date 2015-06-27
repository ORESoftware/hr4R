/**
 * Created by amills001c on 6/12/15.
 */


/**
 * Created by denman on 12/20/2014.
 */


module.exports = function (app) {

    app.param('user_id', function (req, res, next, user_id) {
        // typically we might sanity check that user_id is of the right format
        if (user_id == undefined || user_id == null) {
            console.log('null user_id');
            return next(new Error("user_id is null"));
        }

        //if(user_id !=  req.user._id){
        //    console.log('user_id in url didnt match logged in user...redirecting to login');
        //    req.logout();
        //    res.redirect('/login?error=accessDenied');
        //}

        var UserModel = req.site.models.User;

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

            return next();
        });
    });

/*    app.param('team_id', function (req, res, next, team_id) {

        // var query = Team.where({ _id: team_id });
        if (team_id == 'undefined' || team_id == null) {
            console.log('null team_id');
            req.team = null;
            return next(new Error("player_id is null"));
        }
        var user_id = req.user._id,
            Model = req.site.models.Team;

        var Team = Model.getNewTeam(user_id);
        Team.findById(team_id, function (err, team) {
            console.log("team_id in PARAMS in main:", team_id);
            if (err) {
                return next(err);
            }
            if (!team) {
                console.log('no team matched, team:', team);
                // return new Error("no team matched");
                return next(new Error("no team matched"));
            }
            //console.log("Team in params team_id:", team);
            req.team = team;
            return next();
        });
    });

    app.param('player_id', function (req, res, next, player_id) {
        // typically we might sanity check that user_id is of the right format

        if (player_id == 'undefined' || player_id == null) {
            console.log('null player_id');
            req.player = null;
            return next(new Error("player_id is null"));
        }
        var user_id = req.user._id,
            Model = req.site.models.Player;

        var Player = Model.getNewPlayer(user_id);
        Player.findById(player_id, function (err, player) {
            if (err) {
                return next(err);
            }
            if (!player) {
                console.log('no player matched');
                return next(new Error("no player matched"));
            }
            req.player = player;
            return next();
            //next();
            //return;

        });
    });

    app.param('lineup_id', function (req, res, next, lineup_id) {
        // typically we might sanity check that user_id is of the right format
        if (lineup_id == null) {
            console.log('null lineup_id');
            req.lineup = null;
            return next(new Error("lineup_id is null"));
        }

        var user_id = req.user._id,
            Model = req.site.models.Lineup;

        var Lineup = Model.getNewLineup(user_id);
        Lineup.findById(lineup_id, function (err, lineup) {
            if (err) {
                return next(err);
            }
            if (!lineup) {
                console.log('no lineup matched');
                return next(new Error("no lineup matched"));
            }
            req.lineup = lineup;
            return next();
            //return;
        });
    });*/

    return {}
};