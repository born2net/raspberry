#!/usr/local/bin/node

var rpio = require('rpio');

// Github: https://github.com/jperkin/node-rpio

//rpio.setMode('physical');  /* Use the physical P1-P26/P40 layout */
rpio.setMode('gpio');      /* The default GPIOxx numbering system */

/* GPIO17/Pin11 as we're in physical mode */
console.log('writing to GPIO11')
rpio.setOutput(11);

/* Set the pin high every 10ms, and low 5ms after each transition to high */
setInterval(function() {
    rpio.write(11, rpio.HIGH);
    setTimeout(function() {
        rpio.write(11, rpio.LOW);
    }, 5);
}, 10);