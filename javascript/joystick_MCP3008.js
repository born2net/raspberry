#!/usr/local/bin/node

console.log('--------------------------------------');
console.log('remember to run raspi-config to enable SPI for Dital to Analog to work');
console.log('--------------------------------------');

// first left leg on bottm left MCP3008 is 8...9... etc
var channelX = 12
var channelY = 13

var wpi = require('wiring-pi');
wpi.wiringPiSPISetup(0, 2000000);
var buf1 = new Buffer([1, (channelX)<<4,0]);
var buf2 = new Buffer([1, (channelY)<<4,0]);

var total = function(range, value){
   switch (range){
      case 0: {
         return value;
         break;
      }
      case 1: {
         return value + 254;
         break;
      }
      case 2: {
         return value + 508;
         break;
      }
      case 3: {
         return value + 762;
         break;
      }
   }
}

setInterval(function(){
   var buf1 = new Buffer([1, (channelX)<<4,0]);
   var buf2 = new Buffer([1, (channelY)<<4,0]);
   wpi.wiringPiSPIDataRW(0, buf1);
   wpi.wiringPiSPIDataRW(0, buf2);
   // console.log('[%s,%s,%s]',buf1[0],buf1[1],buf1[2])
   // console.log('[%s,%s,%s]',buf2[0],buf2[1],buf2[2])
    console.log("y: " + total(buf1[1],buf1[2]) + ' ' + "x: " + total(buf2[1],buf2[2]));
},200)

