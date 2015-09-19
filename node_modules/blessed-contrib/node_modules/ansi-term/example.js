
var AnsiTerminal = require('./')
var c = new AnsiTerminal(20, 10)

c.color='cyan'

for (var i=0; i<20; i++) {
   c.set(i, 5)
}

c.fontFg='white'
c.fontBg='red'
c.writeText("123", 7, 7)

c.fontFg='green'
c.fontBg='yellow'
c.writeText("456", 7, 8)

console.log(c.frame())