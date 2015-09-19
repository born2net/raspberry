// var gpio = require('rpi-gpio');
// var five = require("johnny-five");
// var Raspi = require("rpi-gpio");
// var wpi = require('wiring-pi');
var exec = require('child_process').exec;
var gui = require('nw.gui');
var $ = require('jquery');

var child = exec('/root/javascript/gyro_adx335.js');

child.stdout.on('data', function(data) {
    console.log('stdout: ' + data);
    $('h1').text(data);
});
child.stderr.on('data', function(data) {
    console.log('stdout: ' + data);
});
child.on('close', function(code) {
    console.log('closing code: ' + code);
});
