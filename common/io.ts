import {IPlayerData, IGameRoom } from "./game";

export interface ServerToClientEvents {
    gameRoomCreatedEvent: (gr: IGameRoom) => void;
    gameRoomJoinedEvent: (gr: IGameRoom) => void;
    userSessionCreatedEvent: (pdu: IPlayerData) => void;
}

export interface ClientToServerEvents {
    requestUserSession: (pdu: IPlayerData) => void;
    requestNewGameRoom: (pdu: IPlayerData) => void;
    requestJoinGameRoom: (pdu: IPlayerData) => void;
}

