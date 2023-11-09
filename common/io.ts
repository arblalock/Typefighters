import { GameRoom, PlayerData } from "./game";

export interface ServerToClientEvents {
    gameRoomCreatedEvent: (gr: GameRoom) => void;
    gameRoomJoinedEvent: (gr: GameRoom) => void;
}

export interface ClientToServerEvents {
    requestNewGameRoom: (pdu: PlayerData) => void;
    requestJoinGameRoom: (pdu: PlayerData) => void;
}

