/**
 * Created by amills001c on 6/17/15.
 */



define(
    ['socketio',
        'app/js/routers',
        'app/js/allViews'],

    function (io,routers,allViews) {


        var socket = io.connect('http://localhost:3000');


        socket.on('chat message', function(msg){
           console.log('server sent a message to the client,',msg);
        });

        socket.emit('chat message', 'this is the user talking to the server');

        return routers(allViews);
    });

