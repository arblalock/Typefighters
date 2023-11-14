import { GameRoom, PlayerData } from "./game";

export interface ServerToClientEvents {
    gameRoomCreatedEvent: (gr: GameRoom) => void;
    gameRoomJoinedEvent: (gr: GameRoom) => void;
    userSessionCreatedEvent: (pdu: PlayerData) => void;
}

export interface ClientToServerEvents {
    requestUserSession: (pdu: PlayerData) => void;
    requestNewGameRoom: (pdu: PlayerData) => void;
    requestJoinGameRoom: (pdu: PlayerData) => void;
}

