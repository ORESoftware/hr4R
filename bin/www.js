//TODO: process.env.UV_THREADPOOL_SIZE = 1;
//TODO: incorporate cluster module


process.on('uncaughtException', function handleUncaughtException(err) {
    if (global.colors) {
        console.error('uncaughtException--->' + colors.red(String(err)));
    }
    else {
        console.error('uncaughtException--->' + String(err));
    }

    if (process.env.NODE_ENV === 'production') {
        //we are in production, let's cross our fingers
        //set up some alert / email?
    }
    else {
        throw err; //this should crash the server
    }
});

process.on('exit', function exitHook(code) {

    if (global.colors) {
        console.log(colors.magenta('exiting with code', code, '...'));
    }
    else {
        console.log('exiting with code', code, '...');
    }
});

//config
var config = require('univ-config')('*SC-Admin*', 'config/conf');

//////
var app = require('../app');
var debug = require('debug')('sc-ui-express:server');
var http = require('http');
var eventBus = require('../events/eventBus.js');


//eventBus.on('userModel',function(msg){
//
//  console.log('eventBus message!:',msg);
//
//});


/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

if (typeof global.gc === 'function') {
    global.gc(); //garbage collect just for the heck of it
}

var server = http.createServer(app).listen(port); //Listen on provided port, on all network interfaces.

//var server = http.Server(app);
//var io = require('socket.io').listen(server);  //we need to bind socket.io to the http server
//
//require('../lib/controllers/socketio')(io);


//server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

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

    var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(colors.red(bind + ' requires elevated privileges'));
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(colors.red(bind + ' is already in use'));
            process.exit(1);
            break;
        default:
            throw error;
    }
}


function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
}

