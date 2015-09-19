var Canvas = require('./')  
  , w = 55
  , h = 25


function getMaxY() {
    var max = 0;
    
    for(var i = 0; i < data.values.length; i ++) {
        if(data.values[i].Y > max) {
            max = data.values[i].Y;
        }
    }
    
    max += 10 - max % 10;
    return max;
}

// Return the x pixel for a graph point
function getXPixel(val) {
    return ((w - xPadding) / data.values.length) * val + (xPadding * 1.5);
}

// Return the y pixel for a graph point
function getYPixel(val) {
    return h - (((h - yPadding) / getMaxY()) * val) - yPadding;
}



var c = new Canvas(w, h);
var flush = function() {
   console.log(c._canvas.frame())
};

c.clearRect(0, 0, w, h);

var xPadding = 10;
var yPadding = 10;
            
var data = { values:[
    { X: "Jan", Y: 12 },
    { X: "Feb", Y: 28 },
    { X: "Mar", Y: 18 },
    { X: "Apr", Y: 34 },

]};


for(var i = 0; i < getMaxY(); i += 10) {
    c.fillText(i.toString(), xPadding - 5, getYPixel(i));    
}

c.strokeStyle = 'blue';

c.beginPath();

c.lineTo(getXPixel(0), getYPixel(data.values[0].Y));

for(var i = 1; i < data.values.length; i ++) {
    c.lineTo(getXPixel(i), getYPixel(data.values[i].Y));    
}

c.stroke();

c.beginPath();

c.lineTo(xPadding, 0);
c.lineTo(xPadding, h - yPadding);
c.lineTo(w, h - yPadding);

c.stroke();

c.fillStyle="red"


// Draw the X value texts
for(var i = 0; i < data.values.length; i ++) {    
    c.fillText(data.values[i].X, getXPixel(i), h - yPadding + 2);
}


flush()