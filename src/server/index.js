const ws = require("ws")
const { WebSocketServer } = ws;
const wss = new WebSocketServer({ port: process.env.SOCKETIO_PORT });

wss.on('connection', function connection(ws) {
    ws.on('error', console.error);

    ws.on('message', function message(data) {
        console.log('received: %s', data);
    });

    ws.send('something');
});

console.log(`SocketIO server running on http://localhost:${process.env.SOCKETIO_PORT}`)