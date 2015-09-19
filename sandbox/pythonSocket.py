##############################
# Python Socket Server
##############################
import socket as soc
socket = soc.socket(soc.AF_INET, soc.SOCK_STREAM)
address = ('localhost', 5433) # Create an address tuple
socket.bind(address)

while 1 : # This will loop forever
  socket.listen(1)
  print "Someone has connected"
  connection, addrress = socket.accept() # The program blocks here

  while 1 : # While somebody is connected
    data = connection.recv(16) # Try to read 16 bytes.
    if len(data) == 0 :
      print "Disconnected..."
      break
    else :
      # Got some data
      # Do Stuff With it
      print "Got Data"
connection.close() # Close Connection
