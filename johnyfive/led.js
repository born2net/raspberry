#!/usr/local/bin/node
var five = require("johnny-five");
var Raspi = require("raspi-io");
var board = new five.Board({
  io: new Raspi()
});

board.on("ready", function() {
  //var led = new five.Led("P1-12");
  var led = new five.Led("GPIO18");
  led.blink();
  // led.fadeIn();
  setTimeout(function(){
    led.stop()//.off();
    led.on()//.off();
    //led.fadeOut();
    led.off();
    // process.exit()
  },2000);
});
