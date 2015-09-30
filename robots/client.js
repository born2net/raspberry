#!/usr/local/bin/node

/**
 This is the client scripts that does most of the processing for the Robot.
 It listens to GPIO changes, Joystick movements and other changes and controls
 the different devices such as motors and servos. Since some of the libraries
 are only available in Python, the other half of the script is in server.py
 which listens to commands from this client.js script for executions (i.e.: motor controls)
 **/

var HOST = 'localhost';
var PORT = 5432;
var SERVER_CONNECT = 1;
var MAX_JOYSTICK = 1017;
var MODE = 'XINPUT'; // XINPUT or DIRECT_INPUT switch button
var DEBUG = 2;
var skip = 0;

var GPIO = {};
GPIO.ULTRASONIC_IN = 23;
GPIO.ULTRASONIC_OUT = 22;

var SERVO_CENTER = 50;
var TORAL_SERVOS = 16;

for (var i = 0; i < TORAL_SERVOS; i++) {
    var s = 'var servo' + i + ' = SERVO_CENTER';
    eval(s);
}
var net = require('net');
var usonic = require('r-pi-usonic');
var sensor = usonic.createSensor(GPIO.ULTRASONIC_IN, GPIO.ULTRASONIC_OUT, 650);
var Joystick = require("joystick-logitech-f710");


/**
 Socket client to python server
 **/
if (SERVER_CONNECT) {
    var socket = new net.Socket();
    socket.connect(PORT, HOST, function () {
        console.log('Robot connected');
    });

// this event handler is called when data is received on the socket
    socket.on('data', function (data) {
        //log('DATA: ' + data);
    });

// if the socket is closed, this handler will be called
    socket.on('close', function () {
        log('Connection closed');
    });

// catch cont-c
//process.on('SIGINT', function(){
//    socket.destroy();
//    process.exit();
//});
}


/** The following setting were tested using raw potentiometer (adjustable resistor knobs) as joystick **/
//var X_CENTER = 510;
//var Y_CENTER = 516;
//var THRESHOLD_LOW = 500;
//var THRESHOLD_HIGH = 520;
//var joyX = X_CENTER;
//var joyY = Y_CENTER;

/** The following setting were tested using the Logitech 710 joystick **/
var X_CENTER = 510;
var Y_CENTER = 516;
var THRESHOLD_LOW = 490;
var THRESHOLD_HIGH = 540;
var joyX = X_CENTER;
var joyY = Y_CENTER;

/**
 Poll every milliseconds and send commands to python server
 to control motors via joystick movements
 @method pollSendMotorCommands
 @param {Number} i_playerData
 @return {Number} Unique clientId.
 **/
function pollSendMotorCommands() {
    this.m_pollSendMotorCommandss = setInterval(function () {
        log('x ' + joyX + ' y ' + joyY, 1);
        if (skip)
            return;
        controlDifferentialMotors(joyX, joyY);
    }, 25);
}

/**
 Get percenet
 @method perc
 @param {Number} perc
 @param {Number} amount
 @return {Number}
 **/
function perc(num, amount) {
    return num * amount / 100;
}

/**
 Fix string / numeric to decimal
 @method fixDec
 @param {Number} val
 @return {Number}
 **/
function fixDec(val) {
    return parseFloat(val).toFixed(2)
}

/**
 Send motor run to remote server, configured for Adafruit Mini HAT for Raspberry pi
 if you wish to use the RBB2 look at testJoystickLogitech710_rbb2 sample file
 @method runMotor
 @param {Number} leftMotor
 @param {Number} rightMotor
 @param {direction} String
 **/
function sendData(leftMotor, rightMotor, direction) {
    leftMotor = Math.abs(fixDec(leftMotor));
    rightMotor = Math.abs(fixDec(rightMotor));

    // if motor is very low, might as well reset to avoid noise
    leftMotor = leftMotor < 0.2 ? 0 : leftMotor;
    rightMotor = rightMotor < 0.2 ? 0 : rightMotor;

    // convert 0 (low) to 0.99 (high) into 0 - 255 for motor speed
    leftMotor = Math.round(perc(leftMotor, 255) * 100);
    rightMotor = Math.round(perc(rightMotor, 255) * 100);

    log('ADA direction ' + direction + ' leftMotor ' + leftMotor + ' rightMotor ' + rightMotor, 1);

    // construct motor json data
    var jData = {
        leftMotor: leftMotor,
        rightMotor: rightMotor,
        direction: direction
    };

    // construct current servos json data
    for (var i = 0; i < TORAL_SERVOS; i++) {
        var s = 'servo' + i;
        jData[s] = eval('servo' + i);
        eval(s);
    }

    // send data to python server
    if (SERVER_CONNECT)
        socket.write(JSON.stringify(jData));
}

/**
 Calc the joystick x y coords and translate to linear motor differential movement
 @method controlDifferentialMotors
 @param {Number} x
 @param {Number} y
 **/
function controlDifferentialMotors(x, y) {
    var moveY, leftMotor, rightMotor, reduceX, reducePerc;
    var direction = 'none';

    moveY = leftMotor = rightMotor = (Y_CENTER - y) / Y_CENTER;

    if (rightMotor == 1 && leftMotor == 1)
        return;

    log(rightMotor + ' -- ' + leftMotor, 1);

    /**
     sharp turn: enable following lines if you wish to mix
     to stick sharp extreme left and right
     to allow sharp turns via reverse differential: untested
     **/
    // if (y > THRESHOLD_LOW && y < THRESHOLD_HIGH) {
    //    if (x < THRESHOLD_LOW) {
    //        runMotor(1, 1, 'sharpLeft');
    //        return;
    //    }
    //    if (x > THRESHOLD_HIGH) {
    //        runMotor(1, 1, 'sharpRight');
    //        return
    //    }
    // }

    /** FORWARD **/
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

    /** BACK **/
    if (moveY < 0) {
        direction = 'back';

        /** LEFT **/
        if (x < THRESHOLD_LOW) {
            reduceX = X_CENTER - x;
            reducePerc = (reduceX / X_CENTER) * 100;
            leftMotor = Math.abs(leftMotor) + perc(leftMotor, reducePerc);
        }
        /** RIGHT **/
        if (x > THRESHOLD_HIGH) {
            reduceX = X_CENTER - x;
            reducePerc = (reduceX / X_CENTER) * 100;
            rightMotor = Math.abs(rightMotor) - perc(rightMotor, reducePerc);
        }
    }
    sendData(leftMotor, rightMotor, direction);
}

/**
 Log data to console
 @method log
 @param {String} msg
 @return {Number} level
 **/
function log(msg, level) {
    if (DEBUG >= level) {
        console.log(msg);
    }
}

/**
 Listen to /dev/js0 inputts
 @method Joystick.create
 **/
Joystick.create("/dev/input/js0", function (err, joystick) {
    if (err)
        throw err;

    /** cross **/
    joystick.on("button:crossup:press", function () {
        console.log("A button:crossup:press", 3);
        servo2 = 100;
    });
    joystick.on("button:crossup:press:up", function () {
        console.log("B button:crossup:press:up", 3);
        servo2 = 0;
    });
    joystick.on("button:crossdown:press", function () {
        log("C button:crossdown:press", 3);
    });
    joystick.on("button:crossdown:press:up", function () {
        log("D button:crossdown:press:up", 3);
    });
    joystick.on("button:crossleft:press", function () {
        log("E button:crossleft:press", 3);
    });
    joystick.on("button:crossleft:press:up", function () {
        log("F button:crossleft:press:up", 3);
    });
    joystick.on("button:crossright:press", function () {
        log("G button:crossright:press", 3);
    });
    joystick.on("button:crossright:press:up", function () {
        log("H button:crossright:press:up", 3);
    });
    joystick.setMaximumAxesPosition(MAX_JOYSTICK);

    joystick.on("button:a:press", function () {
        log("a1", 3);
    });
    joystick.on("button:a:release", function () {
        log("a2", 3);
    });
    joystick.on("button:a:release", function () {
        log("a2", 3);
    });
    joystick.on("button:a:release", function () {
        log("a2", 3);
    });
    joystick.on("stick:1:vertical:up", function (position) {
        log("1: " + position, 3);
    });
    joystick.on("stick:1:vertical:down", function (position) {
        log("2: " + position, 3);
    });
    joystick.on("stick:1:vertical:zero", function (position) {
        log("3: " + position, 3);
    });
    joystick.on("stick:2:vertical:up", function (position) {
        servo1 = Math.round(position / 10) + 50;
        log("7: " + position + ' ' + servo1);
    });
    joystick.on("stick:2:vertical:down", function (position) {
        servo1 = SERVO_CENTER - Math.round(position / 10);
        if (servo1 < 1)
            servo1 = 0;
        log("8: " + position + ' ' + servo0);
    });
    joystick.on("stick:2:vertical:zero", function (position) {
        log("9: " + position, 3);
    });
    joystick.on("stick:2:horizontal:right", function (position) {
        servo0 = SERVO_CENTER - Math.round(position / 10);
        if (servo0 < 1)
            servo0 = 0;
        log("10: postion" + position + ' servo ' + servo0);
    });
    joystick.on("stick:2:horizontal:left", function (position) {
        servo0 = Math.round(position / 10) + 50;
        log("11: position " + position + ' servo ' + servo0);
    });
    joystick.on("stick:2:horizontal:zero", function (position) {
        log("12: " + position, 3);
    });
    joystick.on("stick:3:horizontal:right", function (position) {
        log("16: " + position, 3);
    });
    joystick.on("stick:3:horizontal:left", function (position) {
        log("17: " + position, 3);
    });
    joystick.on("stick:3:horizontal:zero", function (position) {
        log("18: " + position, 3);
    });
    joystick.on("stick:1:horizontal:right", function (position) {
        joyY = Math.abs((position / 2) + Y_CENTER);
        log("STICK DOWN: " + position + ' joyY: ' + joyY, 3);
    });
    joystick.on("stick:1:horizontal:left", function (position) {
        joyY = Math.abs((position / 2) - Y_CENTER);
        log("STICK UP: " + position + ' joyY: ' + joyY, 3);
    });
    joystick.on("stick:3:vertical:up", function (position) {
        joyX = Math.abs((position / 2) - X_CENTER);
        log("STICK LEFT: " + position + ' joyX: ' + joyX, 3);
    });
    joystick.on("stick:3:vertical:down", function (position) {
        joyX = Math.abs((position / 2) + X_CENTER);
        log("STICK RIGHT: " + position + ' joyX: ' + joyX, 3);
    });
    joystick.on("stick:1:horizontal:right", function (position) {
        joyY = Math.abs((position / 2) + Y_CENTER);
        log("STICK DOWN: " + position + ' joyY: ' + joyY, 3);
    });
    joystick.on("stick:1:horizontal:left", function (position) {
        joyY = Math.abs((position / 2) - Y_CENTER);
        log("STICK UP: " + position + ' joyY: ' + joyY, 3);
    });
    joystick.on("stick:3:vertical:up", function (position) {
        joyX = Math.abs((position / 2) - X_CENTER);
        log("STICK LEFT: " + position + ' joyX: ' + joyX, 3);
    });
    joystick.on("stick:3:vertical:down", function (position) {
        joyX = Math.abs((position / 2) + X_CENTER);
        log("STICK RIGHT: " + position + ' joyX: ' + joyX, 3);
    });
    joystick.on("stick:3:vertical:zero", function (position) {
        log("A: " + position, 3);
    });
    joystick.on("stick:1:horizontal:zero", function (position) {
        log("B: " + position, 3);
    });

    /** Motor controls **/
    joystick.on("button:lb:press", function () {
        sendData(1, 1, 'sharpLeft');
        skip = 1;
    });
    joystick.on("button:lb:release", function () {
        skip = 0;
        sendData(0, 0, 'fwd');
    });
    joystick.on("button:rb:press", function () {
        sendData(1, 1, 'sharpRight');
        skip = 1;
    });
    joystick.on("button:rb:release", function () {
        skip = 0;
        sendData(0, 0, 'fwd');
    });
    joystick.on("button:ls:press", function () {
        log("stop", 2);
        skip = 0;
        sendData(0, 0, 'fwd');
    });
    joystick.on("button:ls:release", function () {
        log("stop", 2);
        skip = 0;
        sendData(0, 0, 'fwd');
    });
});

pollSendMotorCommands();



