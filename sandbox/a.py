import lirc
import time
import RPi.GPIO as GPIO
print "Setting up GPIO"
LED_PIN = 17 #ledje aanzetten
GPIO.setmode(GPIO.BCM)
GPIO.setup(LED_PIN, GPIO.OUT)
GPIO.output(LED_PIN, True)


sockid = lirc.init("rcled", blocking=False)
while True:
try:
button = lirc.nextcode()
print("Press RC button , die geconfigureerd staat in etc/lirc/lircrc!")
GPIO.output(LED_PIN, True)
if len(button) == 0: continue
print(button[0])
print (len(button))
GPIO.output(LED_PIN, False)

time.sleep(1)
except KeyboardInterrupt:
lirc.deinit()
break
