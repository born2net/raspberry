#!/usr/local/bin/node
var exec = require('child_process').exec;
var child = exec('irw');
child.stdout.on('data', function(data) {
    console.log('1 stdout: ' + data);
    if (data.indexOf('START') > -1) {
       console.log('restart');
       exec('reboot');
    }
});
child.stderr.on('data', function(data) {
    console.log('2 stdout: ' + data);
});
child.on('close', function(code) {
    console.log('3 closing code: ' + code);
});
