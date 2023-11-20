import { Server, Socket } from "socket.io";
import { createServer } from "http";
import short from "short-uuid";
import {ClientToServerEvents, ServerToClientEvents} from "../../common/io";
import { GameRoom, IGameRoom, PlayerData, IPlayerData } from "../../common/game";
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
});

const handleUserSessionReq = (socket: Socket, pd: IPlayerData) =>{
    let playerData = PlayerData.PlayerDataFromObj(pd);
    playerData.socketId = socket.id;
    //If player id is null create a unique id
    if(playerData.playerId == null){
        const uuid = `${short.generate()}-${Date.now()}`;
        playerData.playerId = uuid;
    }
    console.log("User session created");
    socket.emit("userSessionCreatedEvent", playerData);
}

const handleNewGameRoomReq = async(socket: Socket, playerData: PlayerData) =>{
    let roomCode = await GetUnqiueRoomCode();
    let newGameRoom = new GameRoom(roomCode);
    newGameRoom.addPlayer(playerData);
    //Add room to Redis
    //TODO: add method to gameroom that turns it into JSON
    let j = newGameRoom.getGameRoomJSON()

    let g = GameRoom.GameRoomFromJSON(j);
    console.log(g);
    //Create room in socket.io


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


const handleJoinRoomReq = (socket: Socket, playerData: PlayerData) =>{
    //TODO: make sure to broadcast to the room that the game can start with all players
    //joined

    // socket.emit("gameRoomJoinedEvent", newGameRoom);
}

server.listen(process.env.SOCKETIO_PORT, async() => {
    if(redis == null){
        redis = await RedisClient.CreateNewClient();
    }
    console.log(`SocketIO server running on http://localhost:${process.env.SOCKETIO_PORT}`)
});

