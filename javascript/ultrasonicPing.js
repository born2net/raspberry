#!/usr/local/bin/node
var usonic = require('r-pi-usonic');
var sensor = usonic.createSensor(23,18, 650)
setInterval(function(){
   try {
      console.log('Distance: ' + sensor().toFixed(2) + ' cm');
   } catch(e) {}
},1000);

