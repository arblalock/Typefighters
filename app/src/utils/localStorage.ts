import { PlayerData } from "@/common/game";

const playerDataKey = "playerData";

export const LocalStorageGetPlayerData = () : PlayerData | null => {
    let result = localStorage.getItem(playerDataKey);
    return result ? PlayerData.PlayerDataFromJSON(result) : null;
}

export const LocalStorageStorePlayerData = (pd?: PlayerData) => {
    if(!pd) return;
    localStorage.setItem(playerDataKey, pd.getPlayerJSON());
}

