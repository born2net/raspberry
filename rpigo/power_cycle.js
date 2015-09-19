#!/usr/local/bin/node
var gpio = require('rpi-gpio');
gpio.setMode(gpio.MODE_BCM); // Sean use BCM so you can reffer to pins on the green board

var pin   = 18;
var delay = 200;
var count = 0;
var max   = 3;

gpio.setup(pin, gpio.DIR_OUT, on);

function on() {
    if (count >= max) {
        gpio.destroy(function() {
            console.log('Closed pins, now exit');
        });
        return;
    }

    setTimeout(function() {
        gpio.write(pin, 1, off);
        count += 1;
    }, delay);
}

function off() {
    setTimeout(function() {
        gpio.write(pin, 0, on);
    }, delay);
}
