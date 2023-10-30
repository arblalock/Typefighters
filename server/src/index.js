"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var socket_io_1 = require("socket.io");
var http_1 = require("http");
var server = (0, http_1.createServer)();
var io = new socket_io_1.Server(server);
io.on('connection', function (socket) {
    console.log('a user connected');
    socket.emit("basicEmit", "Hello");
});
server.listen(process.env.SOCKETIO_PORT, function () {
    console.log("SocketIO server running on http://localhost:".concat(process.env.SOCKETIO_PORT));
});
