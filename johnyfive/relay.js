#!/usr/local/bin/node
var five = require("johnny-five");
var Raspi = require("raspi-io");
var board = new five.Board({
  io: new Raspi()
});

board.on("ready", function() {

  // Create a new `button` hardware instance.
  var button = new five.Button("GPIO21");

  button.on("hold", function() {
    console.log( "Button held" );
  });

  button.on("press", function() {
    console.log("Toggling the relay...");
    relay.toggle()
  });

  button.on("release", function() {
    console.log( "Button released" );
  });

  var relay = new five.Relay("GPIO4");

  /*** RELAY ***/
  //relay.on();
  //relay.off();
  //relay.open();

  relay.close();
  setTimeout(function(){
     relay.open();
  },1000);

  //relay.toggle();

  this.repl.inject({
    relay: relay
  });
});
