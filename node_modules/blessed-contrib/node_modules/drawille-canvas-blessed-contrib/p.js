
var Canvas = require('./')

var xPadding = 20;
var yPadding = 20;

var size = {height: 80, width: 180}
var c = new Canvas(size.width, size.height);

            
c.beginPath();

c.lineTo(xPadding, yPadding);
c.lineTo(xPadding, size.height - yPadding);
c.lineTo(size.width, size.height - yPadding);

c.stroke();

console.log(c._canvas.frame());
