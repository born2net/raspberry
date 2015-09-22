#!/usr/local/bin/node

console.log('remember to run /root/pytongpio/socketPython.py');

var net = require('net');

var HOST = 'localhost';
var PORT = 5432;
var SERVER_CONNECT = 1;

var skip = 0;

/////////////////////////////////
// TCP Socket
/////////////////////////////////
if (SERVER_CONNECT) {
    var socket = new net.Socket();
    socket.connect(PORT, HOST, function () {
        console.log('We are connected to the Receiver!');
        setTimeout(function(){
            var joyX = 0;
            var joyY = 0;
            runMotor(0, 0, 'fwd');
        },2000);
    });

// this event handler is called when data is received on the socket
    socket.on('data', function (data) {
        //console.log('DATA: ' + data);
    });

// if the socket is closed, this handler will be called
    socket.on('close', function () {
        console.log('Connection closed');
    });

// this handler will be called when the process receives the sigint signal,
// like when you press ctrl + c
//process.on('SIGINT', function(){
//    socket.destroy();
//    process.exit();
//});
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
        console.log("a1");
    });
    joystick.on("button:a:release", function () {
        console.log("a2");
    });
    joystick.on("button:a:release", function () {
        console.log("a2");
    });
    joystick.on("button:a:release", function () {
        console.log("a2");
    });

    joystick.on("stick:1:vertical:up", function (position) {
        console.log("1: " + position);
    });
    joystick.on("stick:1:vertical:down", function (position) {
        console.log("2: " + position);
    });
    joystick.on("stick:1:vertical:zero", function (position) {
        console.log("3: " + position);
    });

    joystick.on("stick:2:vertical:up", function (position) {
        console.log("7: " + position);
    });
    joystick.on("stick:2:vertical:down", function (position) {
        console.log("8: " + position);
    });
    joystick.on("stick:2:vertical:zero", function (position) {
        console.log("9: " + position);
    });
    joystick.on("stick:2:horizontal:right", function (position) {
        console.log("10: " + position);
    });
    joystick.on("stick:2:horizontal:left", function (position) {
        console.log("11: " + position);
    });
    joystick.on("stick:2:horizontal:zero", function (position) {
        console.log("12: " + position);
    });

    joystick.on("stick:3:horizontal:right", function (position) {
        console.log("16: " + position);
    });
    joystick.on("stick:3:horizontal:left", function (position) {
        console.log("17: " + position);
    });
    joystick.on("stick:3:horizontal:zero", function (position) {
        console.log("18: " + position);
    });



    // MOTORS DRIVE //
    joystick.on("stick:1:horizontal:right", function (position) {
        joyY = Math.abs((position / 2) + Y_CENTER);
        console.log("STICK DOWN: " + position + ' joyY: ' + joyY);

    });
    joystick.on("stick:1:horizontal:left", function (position) {
        joyY = Math.abs((position / 2) - Y_CENTER);
        console.log("STICK UP: " + position + ' joyY: ' + joyY);

    });
    joystick.on("stick:3:vertical:up", function (position) {
        joyX = Math.abs((position / 2) - X_CENTER);
        console.log("STICK LEFT: " + position + ' joyX: ' + joyX);

    });
    joystick.on("stick:3:vertical:down", function (position) {
        joyX = Math.abs((position / 2) + X_CENTER);
        console.log("STICK RIGHT: " + position + ' joyX: ' + joyX);
    });
    joystick.on("stick:3:vertical:zero", function (position) {
        console.log("A: " + position);
        //joyX = X_CENTER;
        //joyY = Y_CENTER;
    });
    joystick.on("stick:1:horizontal:zero", function (position) {
        console.log("B: " + position);
        //joyX = X_CENTER;
        //joyY = Y_CENTER;
    });
    joystick.on("button:lb:press", function () {
        console.log("lb1");
        runMotor(1, 1, 'sharpLeft');
        skip = 1;
    });
    joystick.on("button:lb:release", function () {
        console.log("lb2");
        skip = 0;
        runMotor(0, 0, 'fwd');
    });
    joystick.on("button:rb:press", function () {
        console.log("rb1");
        runMotor(1, 1, 'sharpRight');
        skip = 1;
    });
       joystick.on("button:rb:release", function () {
        console.log("rb2");
        skip = 0;
        runMotor(0, 0, 'fwd');
    });
    joystick.on("button:ls:press", function () {
        console.log("stop");
        skip = 0;
        runMotor(0, 0, 'fwd');
    });
    joystick.on("button:ls:release", function () {
        console.log("stop");
        skip = 0;
        runMotor(0, 0, 'fwd');
    });



});


setInterval(function () {
    console.log('x ' + joyX + ' y ' + joyY);
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
    console.log('direction ' + direction + ' leftMotor ' + leftMotor + ' rightMotor ' +rightMotor);
    var value = "MOTOR-" + leftMotor + '-' + rightMotor + '-' + direction;
    console.log(value);
    if (SERVER_CONNECT)
        socket.write(value);
}


var CommandDifferentialDrive2 = function (x, y) {
    var moveY, leftMotor, rightMotor, reduceX, reducePerc;
    var direction = 'none';

    moveY = leftMotor = rightMotor = (Y_CENTER - y) / Y_CENTER;

    console.log('ZZZ ' + rightMotor + ' ' + leftMotor);;
    if (rightMotor==1&&leftMotor==1)
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

