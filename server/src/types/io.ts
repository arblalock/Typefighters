export interface ServerToClientEvents {
    basicEmit: (a: string) => void;
}

export interface ClientToServerEvents {
    hello: () => void;
}

export interface SocketData {
    name: string;
    age: number;
}
