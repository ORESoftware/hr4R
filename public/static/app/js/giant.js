/**
 * Created by amills001c on 6/17/15.
 */


console.log('loading app/js/giant.js');

define(

    [
        'socketio',
        'app/js/routers',
        'app/js/allViews'
    ],

    function (io, routers, allViews) {


        var socket = io.connect('http://127.0.0.1:3000');

        //var socket = io.connect('ws://127.0.0.1:3000');


        socket.on('burger', function (msg) {
            console.log('server sent a message to the client,', msg);

            var parsed = JSON.parse(msg);

            socket.emit('sent info to client');
        });

        socket.on('appGlobal_info_from_server', function (msg) {
            console.log('server sent a message to the client,', msg);

            var parsed = JSON.parse(msg);

            for (var prop in msg) {
                appGlobal['prop'] = msg['prop'];
            }

            socket.emit('appGlobal_info_received_on_client');
        });

        //socket.emit('chat message', 'this is the user talking to the server');

        socket.on('error', function socketConnectionErrorCallback(reason) {
            console.error('Unable to connect Socket.IO ---->', reason);
        });

        socket.on('connect', function () {
            console.info('successfully established a working and authorized connection'.toUpperCase());
        });


        return {
            routers: routers(allViews)
        };
    });

