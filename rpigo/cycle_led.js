#!/usr/local/bin/node
var gpio = require('rpi-gpio');
gpio.setMode(gpio.MODE_BCM); // Sean use BCM so you can reffer to pins on the green board

var pin = 18;

function write() {
    gpio.write(pin, true, function(err) {
        if (err) throw err;
        console.log('Written to pin');
		
		setTimeout(function(){
		  gpio.write(pin, false, function(err) {
                     process.exit();
                  });
		},2000)
    });
}

gpio.setup(pin, gpio.DIR_OUT, write);
