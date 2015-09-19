#!/bin/bash
echo "Open in Browser http://192.168.1.102:8080/stream.html"
raspistill --nopreview -w 640 -h 480 -q 8 -o /run/shm/pic.jpg -tl 1 -t 999999 -th 0:0:0 &
LD_LIBRARY_PATH=/usr/local/lib mjpg_streamer -i "input_file.so -f /run/shm/ -n pic.jpg" -o "output_http.so -w /usr/local/www" 
