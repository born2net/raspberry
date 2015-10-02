#!/usr/local/bin/node

var piblaster = require('pi-blaster.js');

console.log('\n\n>>>>> be sure to started pi-blaster deamon /etc/init.d/pi-blaster.boot.sh start\n\n')

// Fade Led on and off
piblaster.setPwm(22, 0);
var i = 0;
var d = 1;
setInterval(function () {
    if (i >= 1)
        d = 0;
    if (i <= 0)
        d = 1;
    d == 0 ? (i = i - 0.001) : (i = i + 0.001)
    piblaster.setPwm(22, i);
}, 1);


// run a server from 0 to 100%
piblaster.setPwm(4, 1);
piblaster.setPwm(17, 0.01);
setTimeout(function () {
    piblaster.setPwm(17, 0.24);
}, 1000);
setTimeout(function () {
    piblaster.setPwm(4, 0.13);
}, 2000);
setTimeout(function () {
    piblaster.setPwm(4, 0.01);
}, 3000);





