#!/usr/local/bin/node
var five = require("johnny-five");
var raspi = require('raspi-io');
var board = new five.Board({
  io: new raspi()
});

board.on("ready", function() {
    io: new raspi()

  var lcd = new five.LCD({
    // LCD pin name  RS  EN  DB4 DB5 DB6 DB7
    // Arduino pin # 7    8   9   10  11  12
    pins: [37, 35, 33, 31, 29, 23],
    //pins: ["GPIO26", "GPIO19", "GPIO13", "GPIO6", "GPIO5", "GPIO11"],
    backlight: 10,
    rows: 2,
    cols: 16
  });

  var frame = 1;
  var col = 0;
  var row = 0;

  lcd.display();
  lcd.useChar("runninga");
  lcd.useChar("runningb");

  this.loop(300, function() {

    lcd.clear().cursor(row, col).print(
      ":running" + (++frame % 2 === 0 ? "a" : "b") + ":"
    );

    if (++col === lcd.cols) {
      col = 0;

      if (++row === lcd.rows) {
        row = 0;
      }
    }
  });
});
