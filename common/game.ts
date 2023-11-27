export interface IGameRoom{
    roomCode: string;
    createdDate: string;
    playerData: Array<PlayerData>;
    currentRound: Number;
}

export interface GameRoom extends IGameRoom { }

export class GameRoom {

    constructor(roomCode: string) {
        this.roomCode = roomCode;
        this.createdDate = new Date().toISOString();
        this.currentRound = 0;
        this.playerData = []
    }

    static GameRoomFromJSON = (data: any) :GameRoom =>{
        if(typeof data === "string"){
            data = JSON.parse(data);
        }
        let result = new GameRoom("");
        return Object.assign(result, data, {})
    }

    addPlayer(pd: PlayerData){
        if(this.getNumPlayers() >=2){
            console.error("Error: Too many players in room, remove one.")
        }
        this.playerData.push(pd);
    }

    removePlayerByPID(playerID: string){
        this.playerData = this.playerData.filter(x=>x.playerId !== playerID);
    }

    removePlayerBySocketID(socketID: string){
        this.playerData = this.playerData.filter(x=>x.socketId !== socketID);
    }

    updatePlayerScore(playerId: string, newScore: Number){
        let p = this.getPlayer(playerId);
        if(p){
            p.currentScore = newScore
        }else{
            console.error("Player does not exist in this room")
        }
    }

    getPlayer(Id: string):PlayerData | undefined{
        return this.playerData.find(x => x.playerId === Id)
    }

    getPlayerIDs(): (string | undefined) [] {
        return this.playerData.map(ele => ele.playerId);
    }  

    getNumPlayers():number{
        return this.playerData.length;
    }

    getGameRoomJSON = ():string =>{
        return JSON.stringify(this);
    }
}

export interface IPlayerData{
    socketId: string;
    playerId: string | undefined;
    currentRoom: string | undefined;
    createdDate: string;
    currentScore: Number;
}

export interface PlayerData extends IPlayerData { }

export class PlayerData {

    constructor(socketId: string, playerId?: string, currentRoom?: string){
        this.socketId = socketId;
        this.playerId = playerId;
        this.currentRoom = currentRoom;
        this.currentScore = 0;
        this.createdDate = new Date().toISOString();
    }

    joinRoom(roomCode: string){
        this.currentRoom = roomCode;
    }

    leaveRoom(){
        this.currentRoom = null;
    }

    static PlayerDataFromJSON = (data: any) :PlayerData =>{
        if(typeof data === "string"){
            data = JSON.parse(data);
        }
        let result = new PlayerData("");
        return Object.assign(result, data, {})
    }

    getPlayerJSON = ():string =>{
        return JSON.stringify(this);
    }
}