#!/usr/local/bin/node
var gpio = require('rpi-gpio');

// mappings DONT USE THIS ANYMORE, USE BCM MODE INSTEAD
var P18 = 12;
var P23 = 16;
var P25 = 22;

// use pin
var PIN = P25

function write() {
    gpio.write(PIN, true, function(err) {
        if (err) throw err;
        console.log('Written to pin');
		
		setTimeout(function(){
		  gpio.write(PIN, false, function(err) {
                     //process.exit();
                  });
		},2000)
    });
}

gpio.setup(PIN, gpio.DIR_OUT, write);
