#!/usr/bin/python

#
# Socket server that node.js connects to, auto starts in /etc/rc.local
#

import socket as soc
import rrb2 as rrb
import time
import sys
import re
import signal

def myexcepthook(exctype, value, traceback):
    if exctype == KeyboardInterrupt:
        socket.close()
        exi()
        print "Handler code goes here"
    else:
        sys.__excepthook__(exctype, value, traceback)


sys.excepthook = myexcepthook


def signal_handler(signal, frame):
    print('You pressed Ctrl+C!')
    sys.exit(1)


signal.signal(signal.SIGINT, signal_handler)
socket = soc.socket(soc.AF_INET, soc.SOCK_STREAM)
address = ('localhost', 5432)  # Create an address tuple
socket.bind(address)
rr = rrb.RRB2(revision=2)

while 1:  # This will loop forever
    socket.listen(1)
    print "Robot has connected"
    connection, addrress = socket.accept()  # The program blocks here
    while 1:  # While somebody is connected
        if rr.sw1_closed():
            print "bye Robot"
            connection.send("Exiting")
            socket.close()
            sys.exit()

        data = connection.recv(1024)
        if len(data) == 0:
            print "Disconnected..."
            break
        else:

            ### MOTOR ###
            ###matchObj = re.match('MOTOR-([0-9].*)$', data)
            matchObj = re.match('MOTOR-([0-9].*?)(-)([0-9].*)(-)(.*)', data)
            if matchObj:
                print "matchObj.group() : ", matchObj.group()
                print "matchObj.group(1) : ", matchObj.group(1)
                print "matchObj.group(2) : ", matchObj.group(2)
                print "matchObj.group(3) : ", matchObj.group(3)
                print "matchObj.group(4) : ", matchObj.group(4)
                print "matchObj.group(5) : ", matchObj.group(5)
                motorLeft = float(matchObj.group(1))
                motorRight = float(matchObj.group(3))
                direction = matchObj.group(5)
                directionLeft = matchObj.group(5)
                directionRight = matchObj.group(5)
                if direction == 'fwd':
                    directionLeft = 1
                    directionRight = 1
                elif direction == 'back':
                    directionLeft = 0
                    directionRight = 0
                elif direction == 'sharpLeft':
                    directionLeft = 1
                    directionRight = 0
                elif direction == 'sharpRight':
                    directionLeft = 0
                    directionRight = 1
                elif direction == 'none':
                    continue
                print "SWITCH ", rr.sw1_closed()
                # print "Distance ", rr.get_distance()
                rr.set_motors(motorLeft, directionLeft, motorRight, directionRight)

            ### LED ###
            matchObj = re.match('LED-([0-9]+)$', data)
            if matchObj:
                value = int(matchObj.group(1))
                print "value : ", value
                rr.set_led1(value)
                rr.set_led2(value)

            # connection.send("ECHO ")
            data = "Echo: " + data
            connection.send(data)
            print data

connection.close()
