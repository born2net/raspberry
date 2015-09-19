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
   var x = readChannel(0).s3;
   var y = readChannel(1).s3;
   var z = readChannel(2).s3;
   // console.log(' x:' + x + ' y:' + y + ' z:' + z);
   if (x <= 82 && x >= 70 && y >= 68 && y <= 82) {
	 console.log('center')
   } else {
      if(x<=70)
         process.stdout.write(' right ');
      if(x>=82)
         process.stdout.write(' left ');
      if(y>=78)
        process.stdout.write(' back');
      if(y<=68)
         process.stdout.write(' forward');
       console.log('');
  }
},200)
