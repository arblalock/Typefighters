import { Server, Socket } from "socket.io";
import { createServer } from "http";
import short from "short-uuid";
import {ClientToServerEvents, IJoinMatchReq, ServerToClientEvents} from "../../common/io";
import { MatchRoom, PlayerData, IPlayerData } from "../../common/game";
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
    socket.on("requestNewMatchRoom", (playerData) => handleNewMatchRoomReq(socket, playerData))
    socket.on("requestJoinMatchRoom", (joinMatchReq) => handleJoinMatchRoomReq(socket, joinMatchReq))
    socket.on("userMatchUpdate", (playerData) => handleUserMatchUpdate(socket, playerData))
    socket.on("disconnect", () => handleUserDisconnect(socket));
});

const handleUserDisconnect = async(socket: Socket)=>{
    for (const room of socket.rooms) {
        if (room !== socket.id) {
            let matchRoom = await redis.getRoom(room);
            matchRoom.removePlayerBySocketID(socket.id);
            redis.addUpdateRoom(matchRoom);
            if(matchRoom.getNumPlayers() < 1){
                redis.removeRoom(matchRoom.roomCode);
                console.log("No players left, removing room...", room);
            }
            console.log("User left room", room);
            socket.to(room).emit("userLeftMatchRoomEvent", matchRoom);
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
    socket.emit("userSessionCreatedEvent", playerData);
}

const handleNewMatchRoomReq = async(socket: Socket, playerData: IPlayerData) =>{
    let roomCode = await GetUnqiueRoomCode();
    let newmatchRoom = new MatchRoom(roomCode);
    let player = PlayerData.PlayerDataFromJSON(playerData);
    player.joinRoom(roomCode);
    newmatchRoom.addPlayer(player);
    //Add room to Redis
    await redis.addUpdateRoom(newmatchRoom);
    //Join room in socket.io
    socket.join(roomCode);
    socket.emit("matchRoomCreatedEvent", newmatchRoom);
}

const GetUnqiueRoomCode = async() : Promise<string> =>{
    while(true){
        let roomCode = GenRoomCode();
        //Check if this roomcode is being used
        const roomExists = await redis.checkRoomExists(roomCode);
        if (roomExists === false) return roomCode;
    }
}

const handleJoinMatchRoomReq = async(socket: Socket, {roomCode, playerData}: IJoinMatchReq) =>{
    //Check if room exists, if not create it
    let matchRoom: MatchRoom;
    let player = PlayerData.PlayerDataFromJSON(playerData);
    let roomExists = await redis.checkRoomExists(roomCode);
    if(roomExists == false){
        matchRoom = new MatchRoom(roomCode);
    }else{
        matchRoom = await redis.getRoom(roomCode);
    }
    let opId = undefined;
    if(matchRoom.getNumPlayers() === 1){
        opId = matchRoom.getMyOpponent(player.playerId);
    }
    player.joinRoom(roomCode, opId);
    let playerInfo = matchRoom.addPlayer(player);

    //If playerInfo is null there is too many players in room
    if(playerInfo === null){
        socket.emit("matchRoomJoinedEvent", null)
    }

    //Update Redis
    redis.addUpdateRoom(matchRoom);

    let payload = {matchRoom: matchRoom, playerData: playerInfo}

    //Emit to room player joining
    socket.to(roomCode).emit("matchRoomJoinedEvent", payload);

    //Send response
    socket.emit("matchRoomJoinedEvent", payload);
}
const handleUserMatchUpdate = async(socket: Socket, playerData: IPlayerData) =>{
    let pd = PlayerData.PlayerDataFromJSON(playerData);
    let gr = await redis.getRoom(pd.currentRoom);
    if(gr){
        gr.updatePlayerData(pd);
        await redis.addUpdateRoom(gr);
    }
    console.log("user update for room: ", gr.roomCode);
    socket.to(gr.roomCode).emit("userMatchUpdateEvent", pd);
}

server.listen(process.env.SOCKETIO_PORT, async() => {
    console.log(`SocketIO server running on http://localhost:${process.env.SOCKETIO_PORT}`)
});

