
function AnsiTerminal(width, height) {
  this.width = width;
  this.height = height;
  this.clear()

  this.fontFg='normal'
  this.fontBg='normal'
  this.color='normal'
}

exports.colors = {
    black: 0
  , red: 1
  , green: 2
  , yellow: 3
  , blue: 4
  , magenta: 5
  , cyan: 6
  , white: 7
  , normal: 9
};

var methods = {
  set: function(coord) {  
    var color = exports.colors[this.color]    
    this.content[coord] = '\033[4' + color + 'm ' + '\033[49m';    
  },
  unset: function(coord) {    
    this.content[coord] = null;
  },
  toggle: function(coord) {    
    this.content[coord] == this.content[coord]==null?'p':null;
  }
};

Object.keys(methods).forEach(function(method) {
  AnsiTerminal.prototype[method] = function(x, y) {
    if(!(x >= 0 && x < this.width && y >= 0 && y < this.height)) {
      return;
    }    
    var coord = this.getCoord(x, y)
    methods[method].call(this, coord);
  }
});

AnsiTerminal.prototype.getCoord = function(x, y) {
    x = Math.floor(x);
    y = Math.floor(y);    
    return x + this.width*y;
}

AnsiTerminal.prototype.clear = function() {
  this.content = new Array(this.width*this.height);
};

AnsiTerminal.prototype.measureText = function(str) {
  return {width: str.length * 1}
};

AnsiTerminal.prototype.writeText = function(str, x, y) {  
  //console.log(str + ": " + x + "," + y)
  var coord = this.getCoord(x, y)
  for (var i=0; i<str.length; i++) {    
    this.content[coord+i]=str[i]
  }

  var bg = exports.colors[this.color]
  var fg = exports.colors[this.fontFg]
  
  this.content[coord] = '\033[3' + fg + 'm' + '\033[4' + bg + 'm' +  this.content[coord]
  this.content[coord+str.length-1] += '\033[39m\033[49m'

}

AnsiTerminal.prototype.frame = function frame(delimiter) {  
  delimiter = delimiter || '\n';
  var result = [];
  for(var i = 0, j = 0; i < this.content.length; i++, j++) {
    if(j == this.width) {
      result.push(delimiter);
      j = 0;
    }

    if(this.content[i] == null) {
      result.push(' ');
    } else {
      result.push(this.content[i])
    }
  }
  result.push(delimiter);
  return result.join('');
};



module.exports = AnsiTerminal;