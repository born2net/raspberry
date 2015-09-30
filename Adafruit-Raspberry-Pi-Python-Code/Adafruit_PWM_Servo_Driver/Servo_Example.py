#!/usr/bin/python

from Adafruit_PWM_Servo_Driver import PWM
import time

# ===========================================================================
# Example Code
# ===========================================================================

# Initialise the PWM device using the default address
pwm = PWM(0x40)
# Note if you'd like more debug output you can instead run:
# pwm = PWM(0x40, debug=True)
pwm.setPWMFreq(60)  # Set frequency to 60 Hz


servoMin = 150  # Min pulse length out of 4096
servoMax = 600  # Max pulse length out of 4096


def setServoPulse(channel, pulse):
    pulseLength = 1000000  # 1,000,000 us per second
    pulseLength /= 60  # 60 Hz
    print "%d us per period" % pulseLength
    pulseLength /= 4096  # 12 bits of resolution
    print "%d us per bit" % pulseLength
    pulse *= 1000
    pulse /= pulseLength
    pwm.setPWM(channel, 0, pulse)


def setServo(channel, value):
    value = float(value)
    print "value 1", value
    value = value / 100 * 450
    print "value 2", value
    value = value + servoMin
    print "value 3", value
    value = int(value);
    pwm.setPWM(channel, 0, value)


while (True):
    # Change speed of continuous servo on channel O
    # pwm.setPWM(0, 0, servoMin)
    # time.sleep(1)
    # pwm.setPWM(0, 0, servoMax)
    setServo(0, 10)
    time.sleep(1)
    setServo(0, 50)
    time.sleep(1)
