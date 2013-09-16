var fs = require('fs');
var BinaryServer = require('binaryjs').BinaryServer;

// Serve client side statically
var bs = BinaryServer({port: 9000});

// wait for new user connections

bs.on('connection', function(client) {
    // incoming stream from browser
    client.on('stream', function(stream, meta) {
	// broadcast to all other clients
	for(var id in bs.clients) {
	    var otherClient = bs.clients[id];
	    if(otherClient != client) {
		var send = otherClient.createStream(meta);
		stream.pipe(send);
	    }
	}
    });
});

