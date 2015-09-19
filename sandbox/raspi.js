var raspi = require('raspi');
var gpio = require('raspi-gpio');

raspi.init(function() {
   var input = new gpio.DigitalInput({
     pin: 'P1-23',
     pullResistor: gpio.PULL_UP
  });
  var output = new gpio.DigitalOutput('P1-12');
  output.write(input.read());
});
