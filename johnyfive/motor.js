#!/usr/local/bin/node
var five = require("johnny-five");
var Raspi = require("raspi-io");
var board = new five.Board({
  io: new Raspi()
});

board.on("ready", function() {

   var motor4 = new five.Led("GPIO4");
   var motor22 = new five.Led("GPIO22");
   var motor12 = new five.Led("GPIO12");
   var motor16 = new five.Led("GPIO16"); 

  var stop = function(){
     motor4.off();
     motor22.off();
     motor12.off();
     motor16.off();
  }
  var fwd = function(){
     //var motor1 = new five.Led("GPIO4");
     //var motor2 = new five.Led("GPIO22");
     motor4.on();
     motor22.on();
  }
  var back = function(){
     //var motor1 = new five.Led("GPIO12");
     //var motor2 = new five.Led("GPIO16");
     motor12.on();
     motor16.on();
  }

 var left = function(){
     //var motor1 = new five.Led("GPIO22");
     //var motor2 = new five.Led("GPIO16");
     motor22.on();
     motor16.on();
  }

 var right = function(){
     //var motor1 = new five.Led("GPIO12");
     //var motor2 = new five.Led("GPIO4");
     motor12.on();
     motor4.on();
  }

 // fwd();
 // back();
 // left();
 back();
   setTimeout(function(){
     stop();
     fwd();
     setTimeout(function(){
       stop();
     },4000)
   },3000);
});
