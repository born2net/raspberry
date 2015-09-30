#!/usr/local/bin/node

/**
 This is the client scripts that does most of the processing for the Robot.
 It listens to GPIO changes, Joystick movements and other changes and controls
 the different devices such as motors and servos. Since some of the libraries
 are only available in Python, the other half of the script is in server.py
 which listens to commands from this client.js script for executions (i.e.: motor controls)
 **/

var noderob = require('noderob').create({
    debug: 1,
    serverConnect: 1
});

socket = noderob.initSocket();
noderob.initServos();
noderob.initJoystick();
noderob.pollSendMotorCommands();

noderob.log('Starting NodeRob...', 1, 'yellow');




