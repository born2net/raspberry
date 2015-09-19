#!/usr/local/bin/node
var Lcd = require('lcd'),
  lcd = new Lcd({
    rs: 26,
    e: 19,
    data: [13, 6, 5, 11],
    cols: 16,
    rows: 2
});
 
function print(str, pos) {
  pos = pos || 0;

  if (pos === str.length) {
    pos = 0;
    lcd.setCursor(16, 0);
  }

  lcd.print(str[pos]);
  console.log(str[pos]  + ' ' + pos);

  setTimeout(function () {
    print(str, pos + 1);
  }, 200);
}

lcd.on('ready', function () {
  lcd.setCursor(16, 0);
  lcd.autoscroll();
  print('Hello, World! ** ');
});
