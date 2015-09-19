#!/usr/local/bin/node

console.log('--------------------------------------');
console.log('remember to run raspi-config to enable SPI for Dital to Analog to work');
console.log('--------------------------------------');

// first left leg on bottm left MCP3008 is 8...9... etc

var wpi = require('wiring-pi');
wpi.wiringPiSPISetup(0, 2000000);

function readChannel(channel){
   channel = 8 + channel;
   var buf = new Buffer([1, (channel)<<4,0]);
   // starting refernce
   // console.log('[%s,%s,%s]',buf[0],buf[1],buf[2]);
   wpi.wiringPiSPIDataRW(0, buf);
   return {
      s1: buf[0],
      s2: buf[1],
      s3: buf[2]
   }
}

setInterval(function(){
   console.log(readChannel(0));
   console.log(readChannel(1));
   console.log(readChannel(2));
},200)
