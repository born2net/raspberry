#!/usr/local/bin/node
var five = require("johnny-five");
var raspi = require('raspi-io');
var board = new five.Board({
  io: new raspi()
});

board.on("ready", function() {

  // Create a new `button` hardware instance.
  var button = new five.Button("GPIO21");

  button.on("hold", function() {
    console.log( "Button held" );
  });

  button.on("press", function() {
    console.log( "Button pressed" );
  });

  button.on("release", function() {
    console.log( "Button released" );
  });
});
