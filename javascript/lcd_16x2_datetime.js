#!/usr/local/bin/node
var ip = require('ip');
var moment = require('moment');
var Lcd = require('lcd'),
  lcd = new Lcd({
    rs: 26,
    e: 19,
    data: [13, 6, 5, 11],
    cols: 16,
    rows: 2
  });
 
// print date / time on 2 rows
lcd.on('ready', function() {
  lcd.setCursor(0, 0); // col 0, row 0
  lcd.print(ip.address()); 
  lcd.once('printed', function() {
    lcd.setCursor(0, 1); // col 0, row 1
    lcd.print(moment(new Date()).format("MM/DD/YY hh:mmA")); // print date

    setTimeout(function(){
      lcd.clear();
    },30000); 

  });
});

/*
lcd.on('ready', function() {
    lcd.setCursor(0, 0);
    // lcd.print(new Date().toString().substring(16, 24));
    lcd.print("ABC");
    lcd.setCursor(0, 1);
    lcd.print("ABC");
});

*/
 
// If ctrl+c is hit, free resources and exit.
process.on('SIGINT', function() {
  lcd.clear();
  lcd.close();
  process.exit();
});
