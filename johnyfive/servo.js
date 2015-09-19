#!/usr/local/bin/node
var raspi = require('raspi-io');
var five = require('johnny-five');
var board = new five.Board({
  io: new raspi()
});

board.on("ready", function() {
   //var servo = new five.Servo("P1-12");
   var servo = new five.Servo("GPIO12");
   servo.sweep();
});
