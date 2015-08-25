

//process.env.UV_THREADPOOL_SIZE = 1;

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

if(typeof global.gc === 'function'){
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


/*TODO:
* // server example
 // Running a gzip operation on every request is quite expensive.
 // It would be much more efficient to cache the compressed buffer.
 var zlib = require('zlib');
 var http = require('http');
 var fs = require('fs');
 http.createServer(function(request, response) {
 var raw = fs.createReadStream('index.html');
 var acceptEncoding = request.headers['accept-encoding'];
 if (!acceptEncoding) {
 acceptEncoding = '';
 }

 // Note: this is not a conformant accept-encoding parser.
 // See http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.3
 if (acceptEncoding.match(/\bdeflate\b/)) {
 response.writeHead(200, { 'content-encoding': 'deflate' });
 raw.pipe(zlib.createDeflate()).pipe(response);
 } else if (acceptEncoding.match(/\bgzip\b/)) {
 response.writeHead(200, { 'content-encoding': 'gzip' });
 raw.pipe(zlib.createGzip()).pipe(response);
 } else {
 response.writeHead(200, {});
 raw.pipe(response);
 }
 }).listen(1337);*/
