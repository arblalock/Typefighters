import { GameRoom } from '../../../common/game';
import { createClient } from 'redis';
type RedisClientConnection = ReturnType<typeof createClient>


export class RedisClient {
    client: RedisClientConnection;

    constructor(client:RedisClientConnection){
        this.client = client;
    }

    getRoom = async(roomCode) : Promise<GameRoom> | null =>{
        let roomJSON = await this.client.get(roomCode)
        if(!roomJSON) return null;
        // return GameRoom.GameRoomFromJSON(roomJSON)
    }

    checkRoomExists = async(roomCode: string):Promise<boolean> =>{
        return await this.client.get(roomCode) ? true : false;
    }

    static CreateNewClient = async():Promise<RedisClient> => {
        let client = await createClient()
        .on('error', err => console.log('Redis Client Error', err))
        .connect();
        return new RedisClient(client);
    }
}
