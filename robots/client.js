#!/usr/local/bin/node

var exec = require('child_process').exec;
var nodeRob = require('noderob').create({
    debug: 1,
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

var c = 0;
nodeRob.on('LCD:BUTTON:DOWN', function (e) {
    nodeRob.setLCD('Hello', 'num ' + c++, 'YELLOW');
});



nodeRob.initLCD();
nodeRob.initLCDButtons();
nodeRob.testLCD();
nodeRob.testGPIO();
nodeRob.testServoBlaster();
nodeRob.start();





