/**
 * Created by amills001c on 6/18/15.
 */

//http://mykospark.net/2014/07/authentication-with-socket-io-1-0-and-express-4-0/
//http://mono.software/posts/Sharing-sessions-between-SocketIO-and-Express-using-Redis/

//var cookieParser = require('cookie');
var cookieParser = require('cookie-parser');
var config = require('../../config/config_constants.json');
var sessionService = require('./session-service.js')
var colors = require('colors');
var sessionMiddleware = require('./session.js');

var io = null;
var connectedUsers = {}; //hash of sockets with socket.id as key and socket as value

var init = function ($io) {

    if (io === null) {

        io = $io;

        /* io.use(function (socket, next) {
         //var handshakeData = socket.handshake || socket.request;
         var handshakeData = socket.request;

         if (handshakeData.headers.cookie && handshakeData.cookie) {

         handshakeData.cookie = cookie.parse(handshakeData.headers.cookie);

         //handshakeData.sessionID = connect.utils.parseSignedCookie(handshakeData.cookie['express.sid'], 'foo'); //pass session secret at end

         handshakeData.sessionID = cookie.parse(handshakeData.cookie['express.sid'], 'foo'); //pass session secret at end

         if (handshakeData.cookie['express.sid'] == handshakeData.sessionID) {
         return next(new Error('Cookie is invalid.'), false);
         }

         } else {
         return next(new Error('No cookie transmitted.'), false);
         }


         console.log('user with socket.id=', socket.id, 'has authenticated successfully.');
         //socket.sessionID =
         //connectedUsers[socket.id] = socket;
         return next(null, true);

         });*/
        /*io.use(function (socket, next) {
         //var handshakeData = socket.handshake || socket.request;

         var handshakeData = socket.request.headers;

         //var handshakeData = socke

         if (handshakeData.cookie) {

         socket.cookie  = cookieParser.parse(handshakeData.cookie);

         //socket.sessionID = socket.cookie['express.sid'].split('.')[0];

         socket.nickname = socket.cookie['nickname'];

         var temp = socket.cookie['express.sid'];

         socket.sessionID = cookie.parse(temp, 'foo'); //pass session secret at end

         if (socket.cookie['express.sid'] == socket.sessionID) {
         return next(new Error('Cookie is invalid.'), false);
         }

         } else {
         return next(new Error('No cookie transmitted.'), false);
         }


         console.log('user with socket.id=', socket.id, 'has authenticated successfully.');
         //socket.sessionID =
         //connectedUsers[socket.id] = socket;
         return next(null, true);

         });*/

        /*   io.use(function socketioSession(socket, next) {
         // create the fake req that cookieParser will expect
         var req = {
         "headers": {
         "cookie": socket.request.headers.cookie
         },
         };

         // run the parser and store the sessionID
         cookieParser('foo')(req, null, function () {
         var name = 'express.sid';
         socket.sessionID = req.signedCookies[name] || req.cookies[name];
         console.log(colors.bgYellow.red('socket.sessionID:',socket.sessionID));
         next();
         });

         //.sessionID = cookie.parse(req.headers.cookie['express.sid'], 'foo');
         });*/

        /* io.use(function (socket, next) {
         var parseCookie = cookieParser('foo');
         var handshake = socket.request;

         parseCookie(handshake, null, function (err, data) {

         if(err){
         return next(err);
         }

         sessionService.get(handshake, function (err, session) {
         if (err) {
         next(new Error(err.message));
         }
         else if (!session) {
         next(new Error("Not authorized"));
         }
         else {
         handshake.sessionID = session;
         next();
         }

         });
         });
         });*/

        io.use(function (socket, next) {
            sessionMiddleware(socket.request, {}, next);

            //sessionMiddleware(socket.request, {}, function(err,res){
            //    socket.sessionID = socket.request.headers;
            //    next(err,res);
            //});
        });


        io.on('connection', function (socket) {
            console.log(colors.bgYellow('a user connected - ', socket.id, 'user socket session:', socket.request.sessionID));

            var sessionID = socket.request.sessionID;
            socket.sessionID = sessionID;
            connectedUsers[socket.id] = socket; //add them here, because they should be authenticated already

            socket.on('chat message', function (msg) {
                console.log(socket.id, 'says', msg);

                socket.emit('chat message', 'hey baby hey - I am '.concat(socket.id));
            });

            socket.on('disconnect', function () {
                console.log('user disconnected -', socket.id);
                connectedUsers[socket.id] = null;
            });
        });
    }
    else if ($io != null) {
        throw new Error('tried to re-init socketio.js by passing new value for io in?? what are you doing.')

    }
    else {

    }


    return {

        io: io,

        addListener: function (sessionID, eventEmitter) {

            var $sock = null;

            for (var socketid in connectedUsers) {
                if (connectedUsers.hasOwnProperty(socketid)) {
                    var sock = connectedUsers[socketid];
                    if (sock != null && sock.sessionID == sessionID) {
                        $sock = sock;
                        console.log(colors.bgRed($sock),'is not null!!');
                        break;
                    }
                }
            }

            if ($sock !== null) {

                console.log(colors.bgCyan('$sock was found in connectedUsers:', $sock));

                $sock.on('sent info to client', function (data) {
                    eventEmitter.emit('sent info to client',true);
                });

                $sock.emit('burger', {burger: 'whoa'});

            }
            else {
                eventEmitter.emit('sent info to client',false);
                console.log('event emitter:', eventEmitter);

            }


        }

    }


};

module.exports = init;