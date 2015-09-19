#!/usr/local/bin/node

var stdin = process.openStdin(); 
require('tty').setRawMode(true);    

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
  stdin.on('keypress', function (chunk, key) {
     //process.stdout.write('Get Chunk: ' + chunk + '\n');
     stop(); 
     console.log(key.name);
     if (key.name == 'up') { fwd(); }
     if (key.name == 'down') { back(); }
     if (key.name == 'space') { stop(); }
     if (key.name == 'left') { left(); }
     if (key.name == 'right') { right(); }
     if (key && key.ctrl && key.name == 'c') process.exit();
   });
 // fwd();
 // back();
 // left();
// back();
   setTimeout(function(){
     //stop();
     //left();
     setTimeout(function(){
      // stop();
     },4000)
   },3000);
});


