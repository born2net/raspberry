#!/usr/local/bin/node

console.log('--------------------------------------');
console.log('remember to run raspi-config to enable SPI for Dital to Analog to work');
console.log('--------------------------------------');

// first left leg on bottm left MCP3008 is 8...9... etc
var channel = 9

var wpi = require('wiring-pi');
wpi.wiringPiSPISetup(0, 2000000);
var buf = new Buffer([1, (channel)<<4,0]);
// starting refernce
// console.log('[%s,%s,%s]',buf[0],buf[1],buf[2]);

setInterval(function(){
   var buf = new Buffer([1, (channel)<<4,0]);
   wpi.wiringPiSPIDataRW(0, buf);
   console.log('[%s,%s,%s]',buf[0],buf[1],buf[2])
},200)

