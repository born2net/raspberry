#!/usr/local/bin/node

var rpio = require('rpio');
rpio.setMode('gpio');
var G = 12;
rpio.setOutput(G);
setInterval(function(){
    var o = rpio.read(G)
    console.log(o);
    if (o){
        rpio.write(G, rpio.LOW);
    } else {
        rpio.write(G, rpio.HIGH);
    }
},1000);

