import { MatchRoom, PlayerData } from "@/common/game";
import { useState } from "react";

export const usePlayerData = (defaultData = {}): [PlayerData, Function] => {
    const [myPlayerData, setMyPlayerData] = useState<Object>(defaultData);
    const updMyPlayerData = (pd: PlayerData) => {
        //Since we are storing a class in state we need to do deep copy
        //using JSON
        setMyPlayerData(pd?.getPlayerJSON())
    }
    return [PlayerData.PlayerDataFromJSON(myPlayerData), updMyPlayerData];
  }
  
  export const useMatchData = (defaultData = {}): [MatchRoom, Function] => {
    const [matchData, updMatchData] = useState<Object>(defaultData);
    const updateMatchData = (md: MatchRoom) => {
        //Since we are storing a class in state we need to do deep copy
        //using JSON
        updMatchData(md.getmatchRoomJSON())
    }
    return [MatchRoom.matchRoomFromJSON(matchData), updateMatchData];
  }