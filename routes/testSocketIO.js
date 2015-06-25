/**
 * Created by amills001c on 6/22/15.
 */



var express = require('express');
var router = express.Router();
var sockets = require('../lib/controllers/socketio.js');
var EventEmitter = require('events').EventEmitter;


router.get('/', function (req, res, next) {

        var sessionID = req.session.id;

        var ee = new EventEmitter();

        ee.on('sent info to client', function onSentInfoToClient(data){
            res.json({hi: data});
        });

        console.log('ee listeners:',ee.listeners('sent info to client'));

        sockets(null).addListener(sessionID,ee);


});


module.exports = router;