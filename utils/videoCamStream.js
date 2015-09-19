#!/usr/local/bin/node
var exec = require('child_process').exec;

var cmd1 = 'raspistill --nopreview -w 640 -h 480 -q 8 -o /run/shm/pic.jpg -tl 1 -t 999999 -th 0:0:0'
var cmd2 = 'LD_LIBRARY_PATH=/usr/local/lib mjpg_streamer -i "input_file.so -f /run/shm/ -n pic.jpg" -o "output_http.so -w /usr/local/www"';

var child1 = exec(cmd1, function (error, stdout, stderr) {
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
    if (error !== null) {
      console.log('exec error: ' + error);
    }
});

var child2 = exec(cmd2, function (error, stdout, stderr) {
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
    if (error !== null) {
      console.log('exec error: ' + error);
    }
});


setTimeout(function(){
  console.log('killing ' + child1.pid + ' ' + child2.pid);
  exec('kill ' + child1.pid, function(){});   
  exec('kill ' + child2.pid, function(){});   
  process.exit();
},5000)
