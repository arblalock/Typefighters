import { MatchRoom } from '../../../common/game';
import { createClient } from 'redis';
type RedisClientConnection = ReturnType<typeof createClient>


export class RedisClient {
    client: RedisClientConnection;

    constructor(client:RedisClientConnection){
        this.client = client;
    }

    getRoom = async(roomCode:string) : Promise<MatchRoom> | null =>{
        let roomJSON = await this.client.get(roomCode)
        if(!roomJSON) return null;
        return MatchRoom.matchRoomFromJSON(roomJSON)
    }

    addUpdateRoom = async(matchRoom:MatchRoom) : Promise<null> =>{
        await this.client.set(matchRoom.roomCode, matchRoom.getmatchRoomJSON());
        return null;
    }

    removeRoom = async(roomCode: string)  : Promise<null> =>{
        if(await this.checkRoomExists(roomCode) == false) return null;
        await this.client.del(roomCode);
        return null;
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
