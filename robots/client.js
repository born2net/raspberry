#!/usr/local/bin/node

var exec = require('child_process').exec;
var nodeRob = require('noderob').create({
    debug: 0,
    serverConnect: 1,
    host: 'localhost',
    port: 5432,
    pollInterval: 25
});

nodeRob.initSocket();
nodeRob.initServos();
nodeRob.initJoystick(function (joystick) {
    var self = nodeRob;

    // override specific behavior
    joystick.removeAllListeners("button:crossup:press");
    joystick.removeAllListeners("button:crossup:press:up");

    joystick.on("button:crossup:press", function () {
        self.setValue('m_servo2', 25);
    });
    joystick.on("button:crossup:press:up", function () {
        self.setValue('m_servo2', 0);
        //console.log(self.getValue('m_servo2'));
    });
});

nodeRob.on('LCD:right', function (e) {
    nodeRob.log('r', 0);
});
nodeRob.on('LCD:left', function (e) {
    nodeRob.log('l', 0);
});
nodeRob.on('LCD:up', function (e) {
    nodeRob.log('u', 0);
});
nodeRob.on('LCD:down', function (e) {
    nodeRob.log('d', 0);
});
nodeRob.on('LCD:select', function (e) {
    nodeRob.log('s', 0);
    var child = exec('shutdown now');
});

nodeRob.testGPIO();
nodeRob.testServoBlaster();

var a = 1;
setInterval(function () {
    nodeRob.setLCD(Math.random() + '\n' + a++, 'magenta');
}, 1000);
nodeRob.start();
nodeRob.log('Starting NodeRob...', 1, 'yellow');




