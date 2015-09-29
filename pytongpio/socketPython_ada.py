#!/usr/bin/python

#
# Python socket server to control two DC motors using
# the Adafruit mini HAT: https://github.com/adafruit/Adafruit-Motor-HAT-Python-Library
#

from Adafruit_MotorHAT import Adafruit_MotorHAT, Adafruit_DCMotor
import socket as soc
import sys
import re
import time
import atexit

def turnOffMotors():
    print "closing app"
    mh.getMotor(1).run(Adafruit_MotorHAT.RELEASE)
    mh.getMotor(2).run(Adafruit_MotorHAT.RELEASE)
    mh.getMotor(3).run(Adafruit_MotorHAT.RELEASE)
    mh.getMotor(4).run(Adafruit_MotorHAT.RELEASE)
    socket.close()

atexit.register(turnOffMotors)

mh = Adafruit_MotorHAT(addr=0x60)


socket = soc.socket(soc.AF_INET, soc.SOCK_STREAM)
address = ('localhost', 5432)  # Create an address tuple
socket.bind(address)

# recommended for auto-disabling motors on shutdown!
def turnOffMotors():
    mh.getMotor(1).run(Adafruit_MotorHAT.RELEASE)
    mh.getMotor(2).run(Adafruit_MotorHAT.RELEASE)
    mh.getMotor(3).run(Adafruit_MotorHAT.RELEASE)
    mh.getMotor(4).run(Adafruit_MotorHAT.RELEASE)

atexit.register(turnOffMotors)

motorA = mh.getMotor(1)
motorB = mh.getMotor(3)
motorA.run(Adafruit_MotorHAT.FORWARD)
motorB.run(Adafruit_MotorHAT.FORWARD)

while 1:  # This will loop forever
    socket.listen(1)
    print "Robot has connected"
    connection, addrress = socket.accept()  # The program blocks here
    while 1:  # While somebody is connected
        data = connection.recv(1024)
        if len(data) == 0:
            print "Disconnected..."
            break
        else:

            ### MOTOR ###
            ###matchObj = re.match('MOTOR-([0-9].*)$', data)
            matchObj = re.match('MOTOR-([0-9].*?)(-)([0-9].*)(-)(.*)', data)
            if matchObj:
                # print "matchObj.group() : ", matchObj.group()
                # print "matchObj.group(1) : ", matchObj.group(1)
                # print "matchObj.group(2) : ", matchObj.group(2)
                # print "matchObj.group(3) : ", matchObj.group(3)
                # print "matchObj.group(4) : ", matchObj.group(4)
                # print "matchObj.group(5) : ", matchObj.group(5)
                motorLeft = matchObj.group(1)
                motorRight = matchObj.group(3)
                direction = matchObj.group(5)
                directionLeft = matchObj.group(5)
                directionRight = matchObj.group(5)
                if direction == 'fwd':
                    directionLeft = 1
                    directionRight = 1
                    motorB.run(Adafruit_MotorHAT.FORWARD)
                    motorA.run(Adafruit_MotorHAT.FORWARD)
                elif direction == 'back':
                    directionLeft = 0
                    directionRight = 0
                    motorB.run(Adafruit_MotorHAT.BACKWARD)
                    motorA.run(Adafruit_MotorHAT.BACKWARD)
                elif direction == 'sharpLeft':
                    directionLeft = 1
                    directionRight = 0
                    motorB.run(Adafruit_MotorHAT.FORWARD)
                    motorA.run(Adafruit_MotorHAT.BACKWARD)
                elif direction == 'sharpRight':
                    directionLeft = 0
                    directionRight = 1
                    motorB.run(Adafruit_MotorHAT.BACKWARD)
                    motorA.run(Adafruit_MotorHAT.FORWARD)
                elif direction == 'none':
                    continue

                ### rr.set_motors(motorLeft, directionLeft, motorRight, directionRight)
                print "Running ", motorLeft + " " +  motorLeft

                motorA.setSpeed(int(motorRight))
                motorB.setSpeed(int(motorLeft))

            data = "Echo: " + data
            connection.send(data)
            print data

connection.close()
