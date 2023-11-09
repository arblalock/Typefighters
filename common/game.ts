//Serialization notes:
//https://stackoverflow.com/questions/16261119/typescript-objects-serialization/71623375#71623375
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

    addPlayer(socketId: string, playerId: string){
        if(this.playerData.length >=2){
            console.error("Error: Too many players in room, remove one.")
        }
        this.playerData.push(new PlayerData(socketId, playerId, this.roomCode));
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
}

export class PlayerData {
    socketId: string;
    playerId: string;
    currentRoom: string;
    currentScore: Number;

    constructor(socketId: string, playerId: string, currentRoom: string){
        this.socketId = socketId;
        this.playerId = playerId;
        this.currentRoom = currentRoom;
        this.currentScore = 0;
    }
}