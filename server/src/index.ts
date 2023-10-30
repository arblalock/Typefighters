import { Server } from "socket.io";
import { createServer } from "http";
import {ClientToServerEvents, InterServerEvents, ServerToClientEvents, SocketData} from "./types/io";

const server = createServer();
const io = new Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
>(server, {'transports':['websocket']});


io.on('connection', (socket) => {
    console.log('a user connected');
    socket.emit("basicEmit", "Hello there");
});

server.listen(process.env.SOCKETIO_PORT, () => {
    console.log(`SocketIO server running on http://localhost:${process.env.SOCKETIO_PORT}`)
});

