export interface IGameRoom{
    roomCode: string;
    createdDate: string;
    playerData: Array<PlayerData>;
    currentRound: Number;
}

export interface IPlayerData{
    socketId: string;
    playerId: string;
    currentRoom: string;
    createdDate: string;
    currentScore: Number;
    gameRooms: string[];
}
export interface GameRoom extends IGameRoom { }
export interface PlayerData extends IPlayerData { }

export class GameRoom {

    constructor(roomCode: string) {
        this.roomCode = roomCode;
        this.createdDate = new Date().toISOString();
        this.currentRound = 0;
        this.playerData = []
    }

    static GameRoomFromObj = (data: Object) : GameRoom =>{
        let result = new GameRoom(null);
        return Object.assign(result, data, {})
    }

    static GameRoomFromJSON = (data: string) : GameRoom =>{
        let result = new GameRoom(null);
        return Object.assign(result, JSON.parse(data), {})
    }

    addPlayer(pd: PlayerData){
        if(this.playerData.length >=2){
            console.error("Error: Too many players in room, remove one.")
        }
        this.playerData.push(pd);
    }

    updatePlayerScore(playerId: string, newScore: Number){
        let p = this.getPlayer(playerId);
        if(p){
            p.currentScore = newScore
        }else{
            console.error("Player does not exist in this room")
        }
    }

    getPlayer(Id: string):PlayerData{
        return this.playerData.find(x => x.playerId === Id)
    }

    getPlayerIDs(): Array<string> {
        return this.playerData.map(ele => ele.playerId);
    }  

    getGameRoomJSON = ():string =>{
        return JSON.stringify(this);
    }
}

export class PlayerData {

    constructor(socketId: string, playerId?: string, currentRoom?: string, gamerooms = []){
        this.socketId = socketId;
        this.playerId = playerId;
        this.currentRoom = currentRoom;
        this.currentScore = 0;
        this.gameRooms = gamerooms;
        this.createdDate = new Date().toISOString();
    }

    static PlayerDataFromObj = (data: Object) :PlayerData =>{
        let result = new PlayerData(null);
        return Object.assign(result, data, {})
    }

    static PlayerDataFromJSON = (data: string) =>{
        let result = new PlayerData(null);
        return Object.assign(result, JSON.parse(data), {})
    }
    getPlayerJSON = ():string =>{
        return JSON.stringify(this);
    }
}