

//TODO: process.env.UV_THREADPOOL_SIZE = 1;
//TODO: incorporate cluster module
//TODO: create dummy data procedures to load dummy data in DB


var debug = require('debug')('sc-ui-express:server');
var http = require('http');
var cluster = require('cluster');
var numCPUs = require('os').cpus().length;


var eventBus = require('../events/eventBus.js');


if (cluster.isMaster) {

    cluster.on('exit', function(worker, code, signal) {
        console.log('worker ' + worker.process.pid + ' died');
    });

    for (var i = 0; i < 3; i++) {
        cluster.fork();
    }

    if(typeof global.gc === 'function'){
        global.gc(); //garbage collect just for the heck of it
    }

} else {
    var app = require('../app');
    var port = normalizePort(process.env.PORT || '3000');
    app.set('port', port);

    if(typeof global.gc === 'function'){
        global.gc(); //garbage collect just for the heck of it
    }

    var server = http.createServer(app).listen(port); //Listen on provided port, on all network interfaces.
    server.on('error', onError);
    server.on('listening', onListening);
}



//var server = http.Server(app);
//var io = require('socket.io').listen(server);  //we need to bind socket.io to the http server
//
//require('../lib/controllers/socketio')(io);




/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
}

