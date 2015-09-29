#!/usr/local/bin/node

var Joystick = require("joystick-logitech-f710");
var net = require('net');

var HOST = 'localhost';
var PORT = 5432;
var SERVER_CONNECT = 1;
var MAX_JOYSTICK = 1017;
var MODE = 'XINPUT'; // XINPUT or DIRECT_INPUT switch button
var DEBUG = 1;
var skip = 0;


console.log('\n\nremember to run /root/pytongpio/socketPython_rrb2.py\n\n');

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

Joystick.create("/dev/input/js0", function (err, joystick) {
    if (err)
        throw err;

    /** cross **/
    joystick.on("button:crossup:press", function () {
        log("A button:crossup:press",3);
    });
    joystick.on("button:crossup:press:up", function () {
        log("B button:crossup:press:up",3);
    });
    joystick.on("button:crossdown:press", function () {
        log("C button:crossdown:press",3);
    });
    joystick.on("button:crossdown:press:up", function () {
        log("D button:crossdown:press:up",3);
    });
    joystick.on("button:crossleft:press", function () {
        log("E button:crossleft:press",3);
    });
    joystick.on("button:crossleft:press:up", function () {
        log("F button:crossleft:press:up",3);
    });
    joystick.on("button:crossright:press", function () {
        log("G button:crossright:press",3);
    });
    joystick.on("button:crossright:press:up", function () {
        log("H button:crossright:press:up",3);
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
        log("7: " + position, 3);
    });
    joystick.on("stick:2:vertical:down", function (position) {
        log("8: " + position, 3);
    });
    joystick.on("stick:2:vertical:zero", function (position) {
        log("9: " + position, 3);
    });
    joystick.on("stick:2:horizontal:right", function (position) {
        log("10: " + position, 3);
    });
    joystick.on("stick:2:horizontal:left", function (position) {
        log("11: " + position, 3);
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

    /** Drive the motors using H-Bridge **/

    if (MODE=='XINPUT'){

        // XINPUT via switch on Logitech remote, more precise but cross stick does not work

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
            log("stop", 2);
            skip = 0;
            runMotor(0, 0, 'fwd');
        });
        joystick.on("button:ls:release", function () {
            log("stop", 2);
            skip = 0;
            runMotor(0, 0, 'fwd');
        });

    } else if (MODE=='DIRECT_INPUT'){

        // DIRECT_INPUT via switch on Logitech remotem, less precise but cross stick works

        joystick.on("stick:3:vertical:down", function (position) {
            joyY = Math.abs((position / 2) + Y_CENTER);
            log("STICK DOWN: " + position + ' joyY: ' + joyY, 3);

        });
        joystick.on("stick:3:vertical:up", function (position) {
            joyY = Math.abs((position / 2) - Y_CENTER);
            log("STICK UP: " + position + ' joyY: ' + joyY, 3);

        });
        joystick.on("stick:3:horizontal:left", function (position) {
            joyX = Math.abs((position / 2) - X_CENTER);
            log("STICK LEFT: " + position + ' joyX: ' + joyX, 3);

        });
        joystick.on("stick:3:horizontal:right", function (position) {
            joyX = Math.abs((position / 2) + X_CENTER);
            log("STICK RIGHT: " + position + ' joyX: ' + joyX, 3);
        });
        joystick.on("stick:3:vertical:zero", function (position) {
            log("A: " + position, 3);
        });
        joystick.on("stick:1:horizontal:zero", function (position) {
            log("B: " + position, 3);
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
        joystick.on("button:rs:press", function () {
            log("stop", 2);
            skip = 0;
            runMotor(0, 0, 'fwd');
        });
        joystick.on("button:rs:release", function () {
            log("stop", 2);
            skip = 0;
            runMotor(0, 0, 'fwd');
        });
    }
});


setInterval(function () {
    log('x ' + joyX + ' y ' + joyY, 1);
    if (skip)
        return;
    CommandDifferentialDrive(joyX, joyY);
}, 200);


function perc(num, amount) {
    return num * amount / 100;
}
function fixDec(val) {
    return parseFloat(val).toFixed(2)
}

/**
 Send motor run to remote server
 @method runMotor
 @param {Number} leftMotor
 @param {Number} rightMotor
 @param {direction} String
 **/
function runMotor(leftMotor, rightMotor, direction) {
    leftMotor = Math.abs(fixDec(leftMotor));
    rightMotor = Math.abs(fixDec(rightMotor));

    // if motor is very low, must as well reset to avoid noise
    leftMotor = leftMotor < 0.2 ? 0 : leftMotor;
    rightMotor = rightMotor < 0.2 ? 0 : rightMotor;
    log('direction ' + direction + ' leftMotor ' + leftMotor + ' rightMotor ' + rightMotor, 1);
    var value = "MOTOR-" + leftMotor + '-' + rightMotor + '-' + direction;
    if (SERVER_CONNECT)
        socket.write(value);
}

/**
 Calc the joystick x y coords and translate to linear motor differential movement
 @method CommandDifferentialDrive
 @param {Number} x
 @param {Number} y
 **/
var CommandDifferentialDrive = function (x, y) {
    var moveY, leftMotor, rightMotor, reduceX, reducePerc;
    var direction = 'none';

    moveY = leftMotor = rightMotor = (Y_CENTER - y) / Y_CENTER;

    if (rightMotor == 1 && leftMotor == 1)
        return;

    log(rightMotor + ' -- ' + leftMotor, 1);

    /** sharp turn: enable following lines
     if you wish to mix to stick sharp
     extreme left and right to allow sharp turns via
     reverse differential: untested **/
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
    runMotor(leftMotor, rightMotor, direction);
};


function log(msg, level) {
    if (DEBUG >= level) {
        console.log(msg);
    }
}