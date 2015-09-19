from gps import *
session = gps() 
session.stream( WATCH_ENABLE | WATCH_NEWSTYLE)

while (1): 
	report = session.next() 
	if report.keys()[ 0] == 'epx' :
		lat = float(report['lat'])
		lon = float(report['lon'])
		print("{\"la\":\"%f\",\"lon\":\"%f\",\"time\":\"%s\"}"% (lat, lon, report['time']))
		time.sleep( 0.5)

