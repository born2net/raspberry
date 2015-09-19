import spidev, time
import sys

spi = spidev.SpiDev()
spi.open(0,0)

def analog_read(channel):
    r = spi.xfer2([1, (8 + channel) << 4, 0])
    adc_out = ((r[1]&3) << 8) + r[2]
    return adc_out
 
while True:
    x = analog_read(0)
    y = analog_read(1)
    z = analog_read(2)
    if x < 340 and x > 320 and y > 320 and y < 340:
	sys.stdout.write("center")
    else:
    	if x < 320:
       	 	sys.stdout.write("Right ")
    	if x > 340:
        	sys.stdout.write("Left ")
    	if y < 330:
        	sys.stdout.write("Forward ")
    	if y > 340:
        	sys.stdout.write("Back ")
    time.sleep(0.2)
    print("x:",x,"y:",y,"z:",z);
