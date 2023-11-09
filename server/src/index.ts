import { Server, Socket } from "socket.io";
import { createServer } from "http";
import {ClientToServerEvents, ServerToClientEvents} from "../../common/io";
import { createClient } from 'redis';
import { GameRoom, PlayerData } from "../../common/game";

const rClient = await createClient()
  .on('error', err => console.log('Redis Client Error', err))
  .connect();

const server = createServer();
const io = new Server<
    ClientToServerEvents,
    ServerToClientEvents
>(server, {'transports':['websocket']});


io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on("requestNewGameRoom", (playerData) => handleNewGameRoomReq(socket, playerData))
    socket.on("requestJoinGameRoom", (playerData) => handleJoinRoomReq(socket, playerData))
});

const handleNewGameRoomReq = (socket: Socket, playerData: PlayerData) =>{
    let newGameRoom = new GameRoom("awdawd")
    socket.emit("gameRoomCreatedEvent", newGameRoom);
}


const handleJoinRoomReq = (socket: Socket, playerData: PlayerData) =>{
    //TODO: make sure to broadcast to the room that the game can start with all players
    //joined

    // socket.emit("gameRoomJoinedEvent", newGameRoom);
}

server.listen(process.env.SOCKETIO_PORT, () => {
    console.log(`SocketIO server running on http://localhost:${process.env.SOCKETIO_PORT}`)
});

