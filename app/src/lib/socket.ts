import { Socket, io } from 'socket.io-client';

export class SocketClient{
    socket: Socket
    constructor(){
        this.socket = io(`${window.location.hostname}:${process.env.NEXT_PUBLIC_SOCKETIO_PORT }`, {transports: ['websocket'], upgrade: false});
    }
}