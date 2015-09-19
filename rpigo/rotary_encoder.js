#!/usr/local/bin/node
var gpio = require('rpi-gpio');
var pinA = 18;
var pinB = 23;

gpio.setMode(gpio.MODE_BCM); // Sean use BCM so you can reffer to pins on the green board

gpio.on('change', function(channel, value) {
    console.log('Channel ' + channel + ' value is now ' + value);
});

gpio.setup(pinA, gpio.DIR_IN, gpio.EDGE_BOTH);
gpio.setup(pinB, gpio.DIR_IN, gpio.EDGE_BOTH);
