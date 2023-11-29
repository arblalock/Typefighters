import {IPlayerData, IMatchRoom } from "./game";

export interface ServerToClientEvents {
    matchRoomCreatedEvent: (gr: IMatchRoom) => void;
    matchRoomJoinedEvent: (gr: IMatchRoom) => void;
    userSessionCreatedEvent: (pdu: IPlayerData) => void;
    userLeftmatchRoom: (gr: IMatchRoom) => void;
}

export interface ClientToServerEvents {
    requestUserSession: (pdu: IPlayerData) => void;
    requestNewmatchRoom: (pdu: IPlayerData) => void;
    requestJoinmatchRoom: (pdu: IPlayerData) => void;
}

