var net = require('net');
var readline = require('readline');

var HOST = 'localhost';
var PORT = 5432;

/////////////////////////////////
// TCP Socket
/////////////////////////////////
var socket = new net.Socket();
socket.connect(PORT, HOST, function() {
  console.log('We are connected to the Receiver!');
});

// this event handler is called when data is received on the socket
socket.on('data', function(data) {
    console.log('DATA: ' + data);
});

// if the socket is closed, this handler will be called
socket.on('close', function() {
    console.log('Connection closed');
});

// this handler will be called when the process receives the sigint signal,
// like when you press ctrl + c
process.on('SIGINT', function(){
    socket.destroy();
});

/////////////////////////////////
// Readline
/////////////////////////////////
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('line', function(cmd){
  socket.write(cmd);
  console.log('Tried to write: ' + cmd);
});

function random(min, max) {
    return Math.random() * (max - min) + min;
}

var v = 0;
setInterval(function(){
    var value = "MOTOR-" + random(0,1);
    socket.write(value);
    v = 1 - v;
    socket.write("LED-"+v);
},100);

