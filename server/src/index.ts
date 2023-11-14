import { Server, Socket } from "socket.io";
import { createServer } from "http";
import short from "short-uuid";
import {ClientToServerEvents, ServerToClientEvents} from "../../common/io";
import { createClient } from 'redis';
import { GameRoom, PlayerData } from "../../common/game";

// const rClient = await createClient()
//   .on('error', err => console.log('Redis Client Error', err))
//   .connect();

const server = createServer();
const io = new Server<
    ClientToServerEvents,
    ServerToClientEvents
>(server, {'transports':['websocket']});


io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on("requestUserSession", (playerData) => handleUserSessionReq(socket, playerData))
    socket.on("requestNewGameRoom", (playerData) => handleNewGameRoomReq(socket, playerData))
    socket.on("requestJoinGameRoom", (playerData) => handleJoinRoomReq(socket, playerData))
});

const handleUserSessionReq = (socket: Socket, playerData: PlayerData) =>{
    playerData.socketId = socket.id;
    //If player id is null create a unique id
    if(playerData.playerId == null){
        const uuid = `${short.generate()}-${Date.now()}`;
        playerData.playerId = uuid;
    }
    console.log("User session created");
    socket.emit("userSessionCreatedEvent", playerData);
}

const handleNewGameRoomReq = (socket: Socket, playerData: PlayerData) =>{
    //Serialization notes:
    //https://stackoverflow.com/questions/16261119/typescript-objects-serialization/71623375#71623375

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

