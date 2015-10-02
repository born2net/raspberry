#!/usr/local/bin/node
var gpio = require('rpi-gpio');
gpio.setMode(gpio.MODE_BCM);

var gpio = require('rpi-gpio');

gpio.on('change', function(channel, value) {
    console.log('Channel ' + channel + ' value is now ' + value);
});
gpio.setup(18, gpio.DIR_IN);


setTimeout(function(){},30000)
