#!/usr/local/bin/node

var noderob = require('noderob').create({
    debug: 0,
    serverConnect: 1,
    host: 'localhost',
    port: 5432,
    pollInterval: 25
});

noderob.initSocket();
noderob.initServos();
noderob.initJoystick(function(joystick){
    var self = noderob;

    // override specific behavior
    joystick.removeAllListeners("button:crossup:press");
    joystick.removeAllListeners("button:crossup:press:up");

    joystick.on("button:crossup:press", function () {
        self.setValue('m_servo2',45);
    });
    joystick.on("button:crossup:press:up", function () {
        self.setValue('m_servo2',0);
        //console.log(self.getValue('m_servo2'));
    });
});

noderob.start();
noderob.log('Starting NodeRob...', 1, 'yellow');




