#!/usr/bin/python
from Adafruit_MotorHAT import Adafruit_MotorHAT, Adafruit_DCMotor

import time
import atexit

# create a default object, no changes to I2C address or frequency
mh = Adafruit_MotorHAT(addr=0x60)

# recommended for auto-disabling motors on shutdown!
def turnOffMotors():
    mh.getMotor(1).run(Adafruit_MotorHAT.RELEASE)
    mh.getMotor(2).run(Adafruit_MotorHAT.RELEASE)
    mh.getMotor(3).run(Adafruit_MotorHAT.RELEASE)
    mh.getMotor(4).run(Adafruit_MotorHAT.RELEASE)

atexit.register(turnOffMotors)

################################# DC motor test!
myMotor4 = mh.getMotor(3)
myMotor4.setSpeed(255)
myMotor4.run(Adafruit_MotorHAT.BACKWARD);

myMotor3 = mh.getMotor(1)
myMotor3.setSpeed(255)
myMotor3.run(Adafruit_MotorHAT.FORWARD);

time.sleep(30)
myMotor3.run(Adafruit_MotorHAT.RELEASE);
myMotor4.run(Adafruit_MotorHAT.RELEASE);

