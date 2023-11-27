import { Server, Socket } from "socket.io";
import { createServer } from "http";
import short from "short-uuid";
import {ClientToServerEvents, ServerToClientEvents} from "../../common/io";
import { GameRoom, PlayerData, IPlayerData } from "../../common/game";
import { GenRoomCode } from "./utils/utilities";
import { RedisClient } from "./db/redis";

let redis:RedisClient;

const server = createServer();
const io = new Server<
    ClientToServerEvents,
    ServerToClientEvents
>(server, {'transports':['websocket']});


io.on('connection', async(socket) => {
    if(redis == null){
        redis = await RedisClient.CreateNewClient();
    }
    console.log('a user connected');
    socket.on("requestUserSession", (playerData) => handleUserSessionReq(socket, playerData))
    socket.on("requestNewGameRoom", (playerData) => handleNewGameRoomReq(socket, playerData))
    socket.on("requestJoinGameRoom", (playerData) => handleJoinRoomReq(socket, playerData))
    socket.on("disconnect", () => handleUserDisconnect(socket));
});

const handleUserDisconnect = async(socket: Socket)=>{
    for (const room of socket.rooms) {
        if (room !== socket.id) {
            let gameRoom = await redis.getRoom(room);
            gameRoom.removePlayerBySocketID(socket.id);
            redis.addUpdateRoom(gameRoom);
            if(gameRoom.getNumPlayers() < 1){
                redis.removeRoom(gameRoom.roomCode);
                console.log("No players left, removing room...", room);
            }
            console.log("User left room", room);
            socket.to(room).emit("userLeftGameRoom", gameRoom);
        }
      }
}

const handleUserSessionReq = (socket: Socket, pd: IPlayerData) =>{
    let playerData = PlayerData.PlayerDataFromJSON(pd);
    playerData.socketId = socket.id;
    //If player id is null create a unique id
    if(playerData.playerId == null){
        const uuid = `${short.generate()}-${Date.now()}`;
        playerData.playerId = uuid;
    }
    console.log("User session created");
    socket.emit("userSessionCreatedEvent", playerData);
}

const handleNewGameRoomReq = async(socket: Socket, playerData: IPlayerData) =>{
    let roomCode = await GetUnqiueRoomCode();
    let newGameRoom = new GameRoom(roomCode);
    let player = PlayerData.PlayerDataFromJSON(playerData);
    player.joinRoom(roomCode);
    newGameRoom.addPlayer(player);
    
    //Add room to Redis
    await redis.addUpdateRoom(newGameRoom);
    //Join room in socket.io
    socket.join(roomCode);
    socket.emit("gameRoomCreatedEvent", newGameRoom);
}

const GetUnqiueRoomCode = async() : Promise<string> =>{
    while(true){
        let roomCode = GenRoomCode();
        //Check if this roomcode is being used
        const roomExists = await redis.checkRoomExists(roomCode);
        if (roomExists === false) return roomCode;
    }
}


const handleJoinRoomReq = (socket: Socket, playerData: IPlayerData) =>{
    //TODO: make sure to broadcast to the room that the game can start with all players
    //joined

    // socket.emit("gameRoomJoinedEvent", newGameRoom);
}

server.listen(process.env.SOCKETIO_PORT, async() => {
    console.log(`SocketIO server running on http://localhost:${process.env.SOCKETIO_PORT}`)
});

