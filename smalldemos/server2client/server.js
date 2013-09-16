var BinaryServer = require('binaryjs').BinaryServer;
var fs = require('fs');

var server = BinaryServer({port: 9000});

// callback function
server.on('connection', function(client) {
    var file = fs.createReadStream(__dirname + '/outset.ogg');
    //var file = fs.createReadStream(__dirname + '/flower.png');
    client.send(file);
});