#!/usr/local/bin/node

log('remember to run /root/pytongpio/socketPython.py');

var net = require('net');

var HOST = 'localhost';
var PORT = 5432;
var SERVER_CONNECT = 1;
var DEBUG = 0;

var skip = 0;

/////////////////////////////////
// TCP Socket
/////////////////////////////////
if (SERVER_CONNECT) {
    var socket = new net.Socket();
    socket.connect(PORT, HOST, function () {
        log('We are connected to the Receiver!');
    });

// this event handler is called when data is received on the socket
    socket.on('data', function (data) {
        //log('DATA: ' + data);
    });

// if the socket is closed, this handler will be called
    socket.on('close', function () {
        log('Connection closed');
    });

// this handler will be called when the process receives the sigint signal,
// like when you press ctrl + c
//process.on('SIGINT', function(){
//    socket.destroy();
//    process.exit();
//});
}

function log(msg, level) {
    if (DEBUG >= level) {
        console.log(msg);
    }
}

var Joystick = require("joystick-logitech-f710");

var joyX = 0;
var joyY = 0;

/** Setting for when using Raspberry pi potentiometer joystick **/
//var X_CENTER = 510;
//var Y_CENTER = 516;
//var THRESHOLD_LOW = 500;
//var THRESHOLD_HIGH = 520;


/** Setting for when using Logitech 710 joystick **/
var X_CENTER = 510;
var Y_CENTER = 516;
var THRESHOLD_LOW = 490;
var THRESHOLD_HIGH = 540;


Joystick.create("/dev/input/js0", function (err, joystick) {
    if (err) {
        throw err;
    }

    joystick.setMaximumAxesPosition(1017);
    joystick.on("button:a:press", function () {
        log("a1",3);
    });
    joystick.on("button:a:release", function () {
        log("a2",3);
    });
    joystick.on("button:a:release", function () {
        log("a2",3);
    });
    joystick.on("button:a:release", function () {
        log("a2",3);
    });

    joystick.on("stick:1:vertical:up", function (position) {
        log("1: " + position,3);
    });
    joystick.on("stick:1:vertical:down", function (position) {
        log("2: " + position,3);
    });
    joystick.on("stick:1:vertical:zero", function (position) {
        log("3: " + position,3);
    });

    joystick.on("stick:2:vertical:up", function (position) {
        log("7: " + position,3);
    });
    joystick.on("stick:2:vertical:down", function (position) {
        log("8: " + position,3);
    });
    joystick.on("stick:2:vertical:zero", function (position) {
        log("9: " + position,3);
    });
    joystick.on("stick:2:horizontal:right", function (position) {
        log("10: " + position,3);
    });
    joystick.on("stick:2:horizontal:left", function (position) {
        log("11: " + position,3);
    });
    joystick.on("stick:2:horizontal:zero", function (position) {
        log("12: " + position,3);
    });

    joystick.on("stick:3:horizontal:right", function (position) {
        log("16: " + position,3);
    });
    joystick.on("stick:3:horizontal:left", function (position) {
        log("17: " + position,3);
    });
    joystick.on("stick:3:horizontal:zero", function (position) {
        log("18: " + position,3);
    });


    // MOTORS DRIVE //
    joystick.on("stick:1:horizontal:right", function (position) {
        joyY = Math.abs((position / 2) + Y_CENTER);
        log("STICK DOWN: " + position + ' joyY: ' + joyY,3);

    });
    joystick.on("stick:1:horizontal:left", function (position) {
        joyY = Math.abs((position / 2) - Y_CENTER);
        log("STICK UP: " + position + ' joyY: ' + joyY,3);

    });
    joystick.on("stick:3:vertical:up", function (position) {
        joyX = Math.abs((position / 2) - X_CENTER);
        log("STICK LEFT: " + position + ' joyX: ' + joyX,3);

    });
    joystick.on("stick:3:vertical:down", function (position) {
        joyX = Math.abs((position / 2) + X_CENTER);
        log("STICK RIGHT: " + position + ' joyX: ' + joyX,3);
    });
    joystick.on("stick:3:vertical:zero", function (position) {
        log("A: " + position,3);
        //joyX = X_CENTER;
        //joyY = Y_CENTER;
    });
    joystick.on("stick:1:horizontal:zero", function (position) {
        log("B: " + position,3);
        //joyX = X_CENTER;
        //joyY = Y_CENTER;
    });
    joystick.on("button:lb:press", function () {
        runMotor(1, 1, 'sharpLeft');
        skip = 1;
    });
    joystick.on("button:lb:release", function () {
        skip = 0;
        runMotor(0, 0, 'fwd');
    });
    joystick.on("button:rb:press", function () {
        runMotor(1, 1, 'sharpRight');
        skip = 1;
    });
    joystick.on("button:rb:release", function () {
        skip = 0;
        runMotor(0, 0, 'fwd');
    });
    joystick.on("button:ls:press", function () {
        log("stop",2);
        skip = 0;
        runMotor(0, 0, 'fwd');
    });
    joystick.on("button:ls:release", function () {
        log("stop",2);
        skip = 0;
        runMotor(0, 0, 'fwd');
    });


});


setInterval(function () {
    log('x ' + joyX + ' y ' + joyY,1);
    if (skip)
        return;
    CommandDifferentialDrive2(joyX, joyY);
}, 200);


function perc(num, amount) {
    return num * amount / 100;
}
function fixDec(val) {
    return parseFloat(val).toFixed(2)
}

// do your motor action here
function runMotor(leftMotor, rightMotor, direction) {
    leftMotor = Math.abs(fixDec(leftMotor));
    rightMotor = Math.abs(fixDec(rightMotor));
    log('direction ' + direction + ' leftMotor ' + leftMotor + ' rightMotor ' + rightMotor,1);
    var value = "MOTOR-" + leftMotor + '-' + rightMotor + '-' + direction;
    if (SERVER_CONNECT)
        socket.write(value);
}


var CommandDifferentialDrive2 = function (x, y) {
    var moveY, leftMotor, rightMotor, reduceX, reducePerc;
    var direction = 'none';

    moveY = leftMotor = rightMotor = (Y_CENTER - y) / Y_CENTER;

    log('ZZZ ' + rightMotor + ' ' + leftMotor,3);

    if (rightMotor == 1 && leftMotor == 1)
        return;

    // sharp turn: enable following lines if you wish to mix to stick sharp turns on extrem left and right stick movements
    /*
     if (y > THRESHOLD_LOW && y < THRESHOLD_HIGH) {
     if (x < THRESHOLD_LOW) {
     runMotor(1, 1, 'sharpLeft');
     return;
     }
     if (x > THRESHOLD_HIGH) {
     runMotor(1, 1, 'sharpRight');
     return
     }
     }
     */

    // fwd
    if (moveY > 0) {
        direction = 'fwd';
        // left
        if (x < THRESHOLD_LOW) {
            reduceX = X_CENTER - x;
            reducePerc = (reduceX / X_CENTER) * 100;
            leftMotor = leftMotor - perc(leftMotor, reducePerc);
        }
        // right
        if (x > THRESHOLD_HIGH) {
            reduceX = X_CENTER - x;
            reducePerc = (reduceX / X_CENTER) * 100;
            rightMotor = rightMotor + perc(rightMotor, reducePerc);
        }
    }

    // back
    if (moveY < 0) {
        direction = 'back';
        // left
        if (x < THRESHOLD_LOW) {
            reduceX = X_CENTER - x;
            reducePerc = (reduceX / X_CENTER) * 100;
            leftMotor = Math.abs(leftMotor) + perc(leftMotor, reducePerc);
        }
        // right
        if (x > THRESHOLD_HIGH) {
            reduceX = X_CENTER - x;
            reducePerc = (reduceX / X_CENTER) * 100;
            rightMotor = Math.abs(rightMotor) - perc(rightMotor, reducePerc);
        }
    }
    runMotor(leftMotor, rightMotor, direction);
};

