var spi = require('pi-spi');
var spinstance = spi.initialize('/dev/spidev0.0');
var buf = new Buffer([1, (8)<<4,0]);
console.log('[%s,%s,%s]',buf[0],buf[1],buf[2]);
spinstance.transfer(buf, buf.length, function(e,d) {
        if (e) console.error(e);
        else console.log('got [%s,%s,%s] back',d[0],d[1],d[2]);
});
