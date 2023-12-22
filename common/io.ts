import {IPlayerData, IMatchRoom } from "./game";

export interface ServerToClientEvents {
    matchRoomCreatedEvent: (mr: IMatchRoom) => void;
    matchRoomJoinedEvent: (mr: IMatchRoom) => void;
    userSessionCreatedEvent: (pd: IPlayerData) => void;
    userLeftMatchRoom: (mr: IMatchRoom) => void;
    userReadyForMatchUpdate: (pd: IPlayerData) => void;
}

export interface ClientToServerEvents {
    requestUserSession: (pd: IPlayerData) => void;
    requestNewMatchRoom: (pd: IPlayerData) => void;
    requestJoinMatchRoom: (jmr: IJoinMatchReq) => void;
    userReadyForMatchReq: (pd: IPlayerData) => void;
}

export interface IMatchAndPlayer {
    playerData: IPlayerData;
    matchRoom: IMatchRoom
}

export interface IJoinMatchReq {
    playerData: IPlayerData;
    roomCode: string;
}
