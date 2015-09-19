#!/usr/local/bin/node
var five = require("johnny-five");
var Raspi = require("raspi-io");
var board = new five.Board({
  io: new Raspi()
});

board.on("ready", function() {
  var led = new five.Led("GPIO6");
  led.blink();
  setTimeout(function(){
    led.stop()//.off();
    led.off();
  },1000);
});
