/**
 * Created by amills001c on 6/18/15.
 */


var cookie = require("cookie");
var connect = require("connect");

module.exports = function (io) {


    io.use(function (socket, next) {
        var handshakeData = socket.request;

        if (handshakeData.headers.cookie && handshakeData.cookie) {

            handshakeData.cookie = cookie.parse(handshakeData.headers.cookie);

            //handshakeData.sessionID = connect.utils.parseSignedCookie(handshakeData.cookie['express.sid'], 'foo'); //pass session secret at end

            handshakeData.sessionID = cookie.parse(handshakeData.cookie['express.sid'], 'foo'); //pass session secret at end

            if (handshakeData.cookie['express.sid'] == handshakeData.sessionID) {
                return next('Cookie is invalid.', false);
            }

        } else {
            return next('No cookie transmitted.', false);
        }

        console.log('user with socket.id=',socket.id,'has authenticated successfully.');
       return next(null, true);

    });


    io.on('connection', function (socket) {
        console.log('a user connected - ', socket.id);

        socket.on('chat message', function (msg) {
            console.log(socket.id, 'says', msg);

            socket.emit('chat message', 'hey baby hey - I am '.concat(socket.id));
        });

        socket.on('disconnect', function () {
            console.log('user disconnected -', socket.id);
        });
    });


}