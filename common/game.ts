export class GameRoom {
    roomCode: string;
    createdDate: string;
    playerData: Array<PlayerData>;
    currentRound: Number;

    constructor(roomCode: string) {
        this.roomCode = roomCode;
        this.createdDate = new Date().toISOString();
        this.currentRound = 0;
    }

    addPlayer(playerData: PlayerData){
        if(this.playerData.length >=2){
            console.error("Error: Too many players in room, remove one.")
        }
        this.playerData.push(playerData);
    }

    updatePlayerScore(playerId: string, newScore: Number){
        let p = this.getPlayer(playerId);
        if(p){
            p.currentScore = newScore
        }else{
            console.error("Player does not exist in this room")
        }
    }

    getPlayer(Id: string){
        return this.playerData.find(x => x.playerId === Id)
    }

    getPlayerIDs(): Array<string> {
        return this.playerData.map(ele => ele.playerId);
    }  

    getGameRoomJSON = ():string =>{
        return JSON.stringify(this);
    }
    
    static GameRoomFromJSON = (gameroom: string): GameRoom =>{
        return new GameRoom("awdwd");
    }
}

export class PlayerData {
    socketId: string;
    playerId: string;
    currentRoom: string;
    currentScore: Number;
    gameRooms: string[];

    constructor(socketId: string, playerId?: string, currentRoom?: string, gamerooms = []){
        this.socketId = socketId;
        this.playerId = playerId;
        this.currentRoom = currentRoom;
        this.currentScore = 0;
        this.gameRooms = gamerooms;
    }
}