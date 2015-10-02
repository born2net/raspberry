#!/usr/local/bin/node

var Gpio = require('onoff').Gpio;
var button = new Gpio(21, 'in', 'rising');

var a = 0;
button.watch(function(err, value) {
    console.log('button ' + value)
});