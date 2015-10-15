#!/usr/local/bin/node

var exec = require('child_process').exec;
var LCDPLATE, lcd;
LCDPLATE = require('adafruit-i2c-lcd').plate;
lcd = new LCDPLATE('/dev/i2c-1', 0x20);
var child = exec('ping digitalsignage.com');
var THRESHOLD = 62;
var c = 0;
child.stdout.on('data', function(data) {
    lcd.clear();
    var n = data.match(/time=(.*)ms/)[1];
    n = parseFloat(n);
    if (n < THRESHOLD){
        lcd.backlight(lcd.colors.GREEN);
    } else {
        lcd.backlight(lcd.colors.RED);
    }
    c++;
    lcd.message('counter ' + c + '\n');
    lcd.message('time ' + n);
});

child.stderr.on('data', function(data) {
    //lcd.message('stdout: ' + data);
});

child.on('close', function(code) {
    //lcd.message('closing code: ' + code);
});

lcd.on('button_change',function(e){
    lcd.clear();
   lcd.message(lcd.buttonName(e));
    if (lcd.buttonName(e)=='RIGHT'){
        var child = exec('shutdown now');
    }
});
