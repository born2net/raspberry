#!/usr/local/bin/node
var exec = require('child_process').exec;
exec('python getgps.py', function callback(error, stdout, stderr){
    var data = JSON.parse(stdout);
    console.log(data.la);
    console.log(data.lon);
    console.log(data.time);
});

