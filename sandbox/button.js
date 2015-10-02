#!/usr/local/bin/node


var gpio = require("pi-gpio");

gpio.open(40, "input", function(err) {     // Open pin 16 for output
    gpio.read(40,function(e) {          // Set pin 16 high (1)
        //gpio.close(16);                     // Close pin 16
        console.log('PIN 40 ' + e);

    });
});


gpio.read(16, function(err, value) {
    if(err) throw err;
    console.log(value); // The current state of the pin
});