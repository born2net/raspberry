var raspi = require('raspi');
var gpio = require('raspi-gpio');

raspi.init(function() {
  var input = new gpio.DigitalInput({
    pin: 'P1-3',
    pullResistor: gpio.PULL_UP
  });
  var output = new gpio.DigitalOutput('P1-5');

  output.write(input.read());
});
