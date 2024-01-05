import {IPlayerData, IMatchRoom, MatchRoom } from "./game";

export interface ServerToClientEvents {
    matchRoomCreatedEvent: (mr: IMatchRoom) => void;
    matchRoomJoinedEvent: (mr: IMatchRoom) => void;
    userSessionCreatedEvent: (pd: IPlayerData) => void;
    userLeftMatchRoomEvent: (mr: IMatchRoom) => void;
    matchUpdateEvent:(mr: MatchRoom) => void; 
}

export interface ClientToServerEvents {
    requestUserSession: (pd: IPlayerData) => void;
    requestNewMatchRoom: (pd: IPlayerData) => void;
    requestJoinMatchRoom: (jmr: IJoinMatchReq) => void;
    userMatchUpdate:(pd: IPlayerData) => void; 
}

export interface IMatchAndPlayer {
    playerData: IPlayerData;
    matchRoom: IMatchRoom
}

export interface IJoinMatchReq {
    playerData: IPlayerData;
    roomCode: string;
}
