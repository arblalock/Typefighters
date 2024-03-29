export interface IMatchRoom{
    roomCode: string;
    createdDate: string;
    playerData: Array<PlayerData>;
    currentRound: Number;
    matchIsRunning: boolean;
    completedTxtIds: Array<Number>;
    currentTxt: string;
}

export interface MatchRoom extends IMatchRoom { }

export class MatchRoom {

    constructor(roomCode: string) {
        this.roomCode = roomCode;
        this.createdDate = new Date().toISOString();
        this.currentRound = 0;
        this.playerData = [];
        this.matchIsRunning = false;
        this.completedTxtIds = [];
        this.currentTxt = "";
    }

    static matchRoomFromJSON = (data: any) :MatchRoom =>{
        if(typeof data === "string"){
            data = JSON.parse(data);
        }
        let newObj = new MatchRoom("");
        let matchObj:MatchRoom;
        matchObj = Object.assign(newObj, data, {})
        let playerObjs = matchObj.playerData.map(x=> PlayerData.PlayerDataFromJSON(x));
        matchObj.playerData = playerObjs;
        return matchObj;
    }

    allPlayersJoined(){
        return this.playerData.length > 1;
    }

    addPlayer(pd: PlayerData):PlayerData|null {
        //Check if player is already in room
        let updatedPd = this.checkIfPlayerIsInRoom(pd);
        //if we do not have player in room, add them
        if(updatedPd === undefined){
            updatedPd = pd;
            //Check that we do not have too many players before adding
            if(this.getNumPlayers() >=2){
                console.log("Too many players in room, not adding...")
                return null;
            }
            this.playerData.push(pd);
        }
        return updatedPd;
    }

    removePlayerByPID(playerID: string){
        this.playerData = this.playerData.filter(x=>x.playerId !== playerID);
    }

    removePlayerBySocketID(socketID: string){
        this.playerData = this.playerData.filter(x=>x.socketId !== socketID);
    }

    updatePlayerData(pd: PlayerData){
        this.playerData = this.playerData.map(x=> x.playerId === pd.playerId ? pd: x);
    }

    //Returns current player data if found
    checkIfPlayerIsInRoom(pd: PlayerData): PlayerData | undefined{
        return this.getPlayerById(pd.playerId, pd.socketId);
    }

    //Get by either player id or socket id
    getPlayerById(playerId?: string, socketId?:string): PlayerData | undefined{
        let result = undefined;
        if(playerId){
            result = this.getPlayerByPlayerId(playerId);
        }
        if(result === undefined && socketId){
            result = this.getPlayerBySocketId(socketId);
        }
        return result;
    }

    getMyOpponent(myPlayerId: string):PlayerData | undefined {
        return this.playerData.find(x=> x.playerId !== myPlayerId);
    }

    getPlayerBySocketId(Id: string):PlayerData | undefined{
        return this.playerData.find(x => x.socketId === Id)
    }

    getPlayerByPlayerId(Id: string):PlayerData | undefined{
        return this.playerData.find(x => x.playerId === Id)
    }

    getPlayerIDs(): (string | undefined) [] {
        return this.playerData.map(ele => ele.playerId);
    }  

    getNumPlayers():number{
        return this.playerData.length;
    }

    checkAllPlayersReady():boolean{
        if(!this.allPlayersJoined) return false;
            for(let u of this.playerData){
                if(u.readyForMatchStart === false){
                    return false
                }
            }
            return true;
    }

    addCompletedTxtId(idx:number){
        this.completedTxtIds.push(idx);
    }
    
    getmatchRoomJSON = ():string =>{
        return JSON.stringify(this);
    }
}

export interface IPlayerData{
    socketId: string | undefined;
    playerId: string | undefined;
    currentRoom: string | undefined;
    createdDate: string;
    currentScore: Number;
    gamesWon: Number;
    readyForMatchStart: boolean;
    myOpponentId: string | undefined;
}

export interface PlayerData extends IPlayerData { }

export class PlayerData {

    constructor(socketId?: string, playerId?: string, currentRoom?: string){
        this.socketId = socketId;
        this.playerId = playerId;
        this.currentRoom = currentRoom;
        this.currentScore = 0;
        this.createdDate = new Date().toISOString();
        this.readyForMatchStart = false;
        this.gamesWon = 0;
    }

    joinRoom(roomCode: string, opponentId = undefined){
        this.currentRoom = roomCode;
        this.myOpponentId = opponentId;
    }

    leaveRoom(){
        this.currentRoom = undefined;
        this.myOpponentId = undefined;
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