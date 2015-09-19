var PythonShell = require('python-shell');
var pyshell = new PythonShell('/root/raspirobotboard/rrb2-1.1/examples/test2.py');

// sends a message to the Python script via stdin
pyshell.send('hello');

pyshell.on('message', function (message) {
  // received a message sent from the Python script (a simple "print" statement)
  console.log(message);
});

// end the input stream and allow the process to exit
pyshell.end(function (err) {
  if (err) throw err;
  console.log('finished');
});
