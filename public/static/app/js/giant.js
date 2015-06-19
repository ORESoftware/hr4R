/**
 * Created by amills001c on 6/17/15.
 */


console.log('loading app/js/giant.js');

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

        socket.on('error', function (reason){
            console.error('Unable to connect Socket.IO', reason);
        });

        socket.on('connect', function (){
            console.info('successfully established a working and authorized connection');
        });


        return {
            routers : routers(allViews)
        };
    });

