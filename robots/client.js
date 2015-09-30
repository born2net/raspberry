#!/usr/local/bin/node

var noderob = require('noderob').create({
    debug: 0,
    serverConnect: 1,
    host: 'localhost',
    port: 5432,
    pollInterval: 25
});

noderob.setModel(noderob.MODEL_TANK);
noderob.initSocket();
noderob.initServos();
noderob.initJoystick();
noderob.start();

noderob.log('Starting NodeRob...', 1, 'yellow');




