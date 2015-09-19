#!/usr/local/bin/node
var gpio = require('rpi-gpio');

// mappings DONT USE THIS ANYMORE, USE BCM MODE INSTEAD
var GPI22 = 15;
var GPI27 = 13;
var GPI04 = 7;
var GPI17 = 11;

var pin = GPI27;

function write() {
    gpio.write(pin, true, function(err) {
        if (err) throw err;
        console.log('Written to pin');
		setTimeout(function(){
		  gpio.write(pin, false, function(err) {
                     //process.exit();
                  });
		},2000)
    });
}

gpio.setup(pin, gpio.DIR_OUT, write);
