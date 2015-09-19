#!/usr/local/bin/node

console.log('--------------------------------------');
console.log('remember to run raspi-config to enable SPI for Dital to Analog to work');
console.log('--------------------------------------');

// first left leg on bottm left MCP3008 is 8...9... etc
var channelX = 12
var channelY = 13

var wpi = require('wiring-pi');
wpi.wiringPiSPISetup(0, 2000000);
var buf1 = new Buffer([1, (channelX) << 4, 0]);
var buf2 = new Buffer([1, (channelY) << 4, 0]);

var total = function (range, value) {
    switch (range) {
        case 0:
        {
            return value;
            break;
        }
        case 1:
        {
            return value + 254;
            break;
        }
        case 2:
        {
            return value + 508;
            break;
        }
        case 3:
        {
            return value + 762;
            break;
        }
    }
}

setInterval(function () {
    var buf1 = new Buffer([1, (channelX) << 4, 0]);
    var buf2 = new Buffer([1, (channelY) << 4, 0]);
    wpi.wiringPiSPIDataRW(0, buf1);
    wpi.wiringPiSPIDataRW(0, buf2);
    // console.log('[%s,%s,%s]',buf1[0],buf1[1],buf1[2])
    // console.log('[%s,%s,%s]',buf2[0],buf2[1],buf2[2])
    var x = total(buf1[1], buf1[2]);
    var y = total(buf2[1], buf2[2]);

    // console.log('x ' + x + ' y ' + y);

    CommandDifferentialDrive2(x, y);
}, 200);

var xBase = 510;
var yBase = 516;


function perc(num, amount) {
    return num * amount / 100;
}

var fixDec = function (val) {
    return parseFloat(val).toFixed(2)
};








var CommandDifferentialDrive2 = function (x, y) {
    var moveY, leftMotor, rightMotor;
    moveY = leftMotor = rightMotor = (yBase - y) / yBase;

    // fwd
    if (moveY > 0) {
        // left
        if (x < 505) {
            var reduceX = xBase - x;
            var reducePerc = (reduceX / xBase) * 100;
            leftMotor = 1 - perc(leftMotor,reducePerc);
        }
        // right
        if (x > 515) {
            var reduceX = xBase - x;
            var reducePerc = (reduceX / xBase) * 100;
            rightMotor = 1 + perc(rightMotor,reducePerc);
        }
    }

    // back
    if (moveY < 0) {
        if (x < 505) {
            var reduceX = xBase - x;
            var reducePerc = (reduceX / xBase) * 100;
            leftMotor = 1 + perc(leftMotor,reducePerc);
        }
        // right
        if (x > 515) {
            var reduceX = xBase - x;
            var reducePerc = (reduceX / xBase) * 100;
            rightMotor = 1 - perc(rightMotor,reducePerc);
        }
    }
    console.log('leftMotor ' + fixDec(leftMotor) + ' rightMotor ' + fixDec(rightMotor));
};

var CommandDifferentialDrive = function (intXpos, intYpos) {

    var PosMax = 1017;
    var PosMin = 0;

    // Calculate Throttled Steering Motor values
    var dblSteer = intXpos / PosMax;

    // Turn with with throttle
    var dblTsMotorA = intYpos * (1 + dblSteer);
    dblTsMotorA = Limit(dblTsMotorA, PosMin, PosMax);	// Govern Axis to Minimum and Maximum range
    var dblTsMotorB = intYpos * (1 - dblSteer);
    dblTsMotorB = Limit(dblTsMotorB, PosMin, PosMax);	// Govern Axis to Minimum and Maximum range

    // Calculate No Throttle Steering Motors values (Turn with little to no throttle)
    var dblThrot = 1 - Math.abs(intYpos / PosMax);	// Throttle inverse magnitude
    // (1 = min, 0 = max)
    var dblNtsMotorA = -intXpos * dblThrot;
    var dblNtsMotorB = intXpos * dblThrot;

    // Calculate final motor output values
    var dblMotorA = dblTsMotorA + dblNtsMotorA;
    dblMotorA = Limit(dblMotorA, PosMin, PosMax);

    var dblMotorB = dblTsMotorB + dblNtsMotorB;
    dblMotorB = Limit(dblMotorB, PosMin, PosMax);

    // Now do something with dblMotorA and dblMotorB
    console.log('MotorA ' + Math.round(dblMotorA) + ' motorB ' + Math.round(dblMotorB));
};

var Limit = function (Value, Minimum, Maximum) {
    if (Value > Maximum)
        Value = Maximum;
    if (Value < Minimum)
        Value = Minimum;
    return Value;
};

