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
address = ('localhost', 5432) # Create an address tuple
socket.bind(address)

rr = rrb.RRB2(revision=2)
while 1 : # This will loop forever
	socket.listen(1)
	print "Someone has connected"
	connection, addrress = socket.accept() # The program blocks here

	while 1 : # While somebody is connected
		data = connection.recv(1024)
		if len(data) == 0 :
			print "Disconnected..."
			break
		else :

                        ### MOTOR ###
			matchObj = re.match('MOTOR-([0-9].*)$',data)
			if matchObj:
				# print "matchObj.group() : ", matchObj.group()
				# print "matchObj.group(1) : ", matchObj.group(1)
				# print "matchObj.group(2) : ", matchObj.group(2)
                                value = float(matchObj.group(1))
				print "value : ", value
                     	   	rr.set_motors(value, 0, value, 0)
                     	   	# rr.set_motors(0, 0, float(matchObj.group(1)), 0)

                        ### LED ###
			matchObj = re.match('LED-([0-9]+)$',data)
			if matchObj:
                                value = int(matchObj.group(1))
				print "value : ", value
                     	   	rr.set_led1(value)
                     	   	rr.set_led2(value)

                        connection.send("ECHO ")
			data = "Echo: " + data
                        connection.send(data)
			print data

connection.close() 
