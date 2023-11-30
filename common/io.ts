import {IPlayerData, IMatchRoom } from "./game";

export interface ServerToClientEvents {
    matchRoomCreatedEvent: (mr: IMatchRoom) => void;
    matchRoomJoinedEvent: (mr: IMatchRoom) => void;
    userSessionCreatedEvent: (pdu: IPlayerData) => void;
    userLeftMatchRoom: (mr: IMatchRoom) => void;
}

export interface ClientToServerEvents {
    requestUserSession: (pdu: IPlayerData) => void;
    requestNewMatchRoom: (pdu: IPlayerData) => void;
    requestJoinMatchRoom: (jmr: IJoinMatchReq) => void;
}

export interface IJoinMatchReq {
    playerData: IPlayerData;
    roomCode: string;
}
