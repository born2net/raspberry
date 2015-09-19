var IRRecord = require('infrared').irrecord;

var irrecord = new IRRecord();
irrecord.on('stdout', function(data) {
  console.log(data);
});
irrecord.on('stderr', function(data) {
  console.log(data);
});
irrecord.on('exit', function() {
  // handle exit event
});
irrecord.start('remote', {disable_namespace: true});
