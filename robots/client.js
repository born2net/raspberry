#!/usr/local/bin/node
var exec = require('child_process').exec;
var noderob = require('noderob').createNodeRob({
    debug: 0,
    serverConnect: 1,
    host: 'localhost',
    port: 5432,
    pollInterval: 25
});

var commBroker = require('noderob').createComBroker();

noderob.initSocket();
noderob.initServos();
noderob.initJoystick(function (joystick) {
    var self = noderob;

    // override specific behavior
    joystick.removeAllListeners("button:crossup:press");
    joystick.removeAllListeners("button:crossup:press:up");

    joystick.on("button:crossup:press", function () {
        self.setValue('m_servo2', 45);
    });
    joystick.on("button:crossup:press:up", function () {
        self.setValue('m_servo2', 0);
        //console.log(self.getValue('m_servo2'));
    });
});

commBroker.listen('LCD:right',function(e){
    noderob.log('r',0);
});
commBroker.listen('LCD:left',function(e){
    noderob.log('l',0);
});
commBroker.listen('LCD:up',function(e){
    noderob.log('u',0);
});
commBroker.listen('LCD:down',function(e){
    noderob.log('d',0);
});
commBroker.listen('LCD:select',function(e){
    noderob.log('s',0);
    var child = exec('shutdown now');
});


var a = 1;
setInterval(function () {
    noderob.setLCD(Math.random() + '\n' + a++, 'magenta');
}, 1000);
noderob.start();
noderob.log('Starting NodeRob...', 1, 'yellow');




