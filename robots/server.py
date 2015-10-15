#!/usr/bin/python
#
# Python socket server to control two DC motors using
# the Adafruit mini HAT: https://github.com/adafruit/Adafruit-Motor-HAT-Python-Library
#
import socket as soc
import sys
import re
import time
import json
import atexit

totalArgs = len(sys.argv)
if totalArgs < 2:
    print "Usage: server.py [0/1 servo-hat]"
    sys.exit()

# Enable / Disable HATs
enableServoHAT = int(sys.argv[1])

if enableServoHAT:
    from Adafruit_PWM_Servo_Driver import PWM
    pwm = PWM(0x40)
    pwm.setPWMFreq(60)

servoMin = 150  # Min pulse length out of 4096
servoMax = 600  # Max pulse length out of 4096
totalServos = 13
debug = 1

# json_string = '{"first_name": "Guido", "last_name":"Rossum"}'
# parsed_json = json.loads(json_string)
# print(parsed_json['last_name'])

def appExiting():
    socket.close()
    if enableServoHAT:
        setServo(13,50)
        setServo(14,50)

socket = soc.socket(soc.AF_INET, soc.SOCK_STREAM)
address = ('localhost', 5432)
socket.bind(address)
atexit.register(appExiting)


def setServoPulse(channel, pulse):
    pulseLength = 1000000  # 1,000,000 us per second
    pulseLength /= 60  # 60 Hz
    # print "%d us per period" % pulseLength
    pulseLength /= 4096  # 12 bits of resolution
    # print "%d us per bit" % pulseLength
    pulse *= 1000
    pulse /= pulseLength
    pwm.setPWM(channel, 0, pulse)


def setServo(channel, value):
    value = float(value)
    value = value / 100 * 450
    value = value + servoMin
    # print "value ", value
    value = int(value)
    pwm.setPWM(channel, 0, value)

while 1:
    socket.listen(1)
    print "Robot has server is listening"
    connection, addrress = socket.accept()  # The program blocks here
    while 1:  # While somebody is connected
        data = connection.recv(4096)
        if len(data) == 0:
            print "Disconnected..."
            break
        else:

            ### process json commands ###
            try:
                parsed_json = json.loads(data)
            except Exception:
                continue

            ### servos ###
            if enableServoHAT:
                try:
                    for i in xrange(0, totalServos):
                        a = int(parsed_json['servo' + str(i)])
                        exec ("servo%s = %d" % (i, a))
                    for i in xrange(0, totalServos):
                        exec ("setServo(%s,servo%s)" % (i, i))
                except:
                    pass

            ### motors ###
            if enableServoHAT:
                motorLeft = parsed_json['leftMotor']
                motorRight = parsed_json['rightMotor']

                if debug:
                    print("motorLeft", motorLeft)
                    print("motorRight", motorRight)

                setServo(15,motorLeft)
                setServo(14,motorRight)

                    # print "Running ", motorLeft + " " + motorLeft
                    # motorA.setSpeed(int(motorRight))
                    # motorB.setSpeed(int(motorLeft))

        ### enable the following lines if you want to send data back to client
        # data = "Echo: " + data
        # connection.send(data)
        if debug:
            print data

connection.close()
